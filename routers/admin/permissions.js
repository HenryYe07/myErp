const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const getIDbyUserName = require('../../modules/getUserID')

const serverKey = 'oooooiiiskskkkskks12348765'

router.post('/',(request,response)=>{
    response.send("Admin OK")
})

const permissionGroupModel = require('../../db/permissionGroupModel')

// 设置用户所在的分组
// 注意这个api是清除原来的所有分组，至于加入多个组，让前端自己把原来的拉回来拼起来
router.post('/setUserPermissionGroup',(request,response)=>{
    userModel.updateOne(
        {username: request.body.settingUsername},
        {permissionGroup: request.body.setGroup}
    ).then((result)=>{
        if(result.matchedCount == 0){
            response.status(404)
            response.send('cannot find the user')
        }else if(result.modifiedCount == 0){
            response.status(202)
            response.send("not modified in fact though found")
        }else{
            response.status(200)
            response.send('OK')
        }

    }).catch((err)=>{
        response.status(500)
        response.send("Server Error")
    })
})

// 创建权限组
router.post("/newPermissionGroup",(request,response)=>{
    var newGroupName = request.body.newGroupName
    permissionGroupModel.create({
        groupName: newGroupName,
        permission: []
    })
    .then(()=>{
        response.status(200)
        response.send("New Group Created")
    }).catch((err)=>{
        if(err.name == 'ValidationError'){
            response.status(400)
            response.send("Not Filled")
            return
        }
        if(err.code == 11000){
            response.status(409)
            response.send("Groupname Confilected")
            return
        }
        response.status(500)
        response.send("Unknown Server Error")
        
    })
})

// 获取所有权限组（后面写，只有管理员有这个权限 的中间件）
router.get('/allPermissionGroups',(request,response)=>{
    permissionGroupModel.find().then((data)=>{
        response.json(data)
    })
})

// 设置权限组的权限
router.post('/setGroupPermission',(request,response)=>{

    permissionGroupModel.updateOne({
        groupName: request.body.groupName,
        permissionList: request.body.permissionList
    }).then((result)=>{
        if(result.matchedCount == 0){
            response.status(404)
            response.send('cannot find the group')
        }else if(result.modifiedCount == 0){
            response.status(202)
            response.send("not modified in fact though found")
        }else{
            response.status(200)
            response.send('OK')
        }

    }).catch((err)=>{
        response.status(500)
        response.send("Server Error")
    })
})






module.exports = router