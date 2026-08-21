const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')

const serverKey = 'oooooiiiskskkkskks12348765'

router.post('/login',(request,response)=>{
    console.log("login api requiested")
    // 请求来的内容：{ username: 'adminn', password: 'admin' }

    userModel.find({"username":request.body.username}).then((data)=>{
        if(data[0] && data[0].password == request.body.password){
            response.status(200)

            // 获取新的token
            let token = jwt.sign({
                id: data[0]._id,
                tokenVersion: data[0].tokenVersion+1,
                loginTime: new Date()

            },serverKey)

            // 把新token的版本信息存进数据库
            userModel.updateOne({"username":request.body.username},{
                tokenVersion: data[0].tokenVersion+1
            }).then((res)=>{
                // console.log(res)
            })
            response.cookie("token",token)
            // console.log('当前版本是',data[0]['tokenVersion']+1)
            response.send("登陆成功")
            
        }
        else{
            response.status(403)
            response.send("账号或密码错误")
        }
    }) // end userModel.find({"username":request.body.username}).then((data)=>{

})// end router.post('/login',(request,response)=>{


// 注册功能
router.post('/register',async(request,response)=>{
    let newMemID = await userModel.find().sort({ memID: -1 }).limit(1)
    newMemID = String(Number(newMemID[0].memID)+1).padStart(6,"0")
    let newUserObj = {
        username: request.body.username,
        password: request.body.password,
        email: request.body.email,
        permissionGroup: ["anyUsers"],
        memID: newMemID,
        tokenVersion:0,
        realName: request.body.realName,
    }
    console.log(newUserObj)
    userModel.create(newUserObj)
    .then(()=>{
        response.status(201)
        response.send("OK")
        console.log("注册成功")
    })
    .catch((err)=>{
        if(err.name == 'ValidationError'){
            response.status(400)
            response.send("Not Filled")
            return
        }
        if(err.code == 11000){
            response.status(409)
            response.send("Username Confilected")
            return
        }
        response.status(500)
        response.send("Unknown Server Error")
        
    })
})

const auth = require("../middleware/auth")
// 这个中间件 提供了一个request.userID

router.post("/change-info",auth,async (request,response)=>{

    let userInfo_db = await userModel.findOne({_id:request.userID})

    let changed_userInfo_obj = {
        username: request.body.username || userInfo_db.username,
        password: request.body.password || userInfo_db.password,
        email: request.body.email || userInfo_db.email,
        realName: request.body.realName || userInfo_db.realName,
    }
    userModel.updateOne({_id:request.userID},changed_userInfo_obj)
    .then(()=>{
        response.status(200)
        response.send('changed')
    })
    .catch((err)=>{
        response.status(403)
        response.send('fail to change')
    })
})

router.post('/logout',auth,async(request,response)=>{
    
    let userInfo_db = await userModel.findOne({_id:request.userID})

    userModel.updateOne({_id:request.userID},{
        tokenVersion: userInfo_db.tokenVersion+1
    })
    .then(()=>{
        response.clearCookie('token')
        response.status(200)
        response.send('Safely Logged Out')
    })
    .catch((err)=>{
        response.status(403)
        response.send('Fail to Log Out')
    })
})


module.exports = router