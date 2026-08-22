const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const getIDbyUserName = require('../modules/getUserID')

const serverKey = 'oooooiiiskskkkskks12348765'

const todoModel = require("../db/todoModel")
// 创建todo
router.post("/",(request,response)=>{
    const memberList = []
    
    request.body.memList.forEach((item)=>{
        memberList.push({
            userID:item,
            attitude:"waiting"
            
        })
    })
    todoModel.create({
        content: request.body.content,
        startTime: String(new Date(request.body.startTime)),
        endTime: String(new Date(request.body.endTime)),
        member: memberList,
        creatorID: request.userID
    }).then((data)=>{
        response.status(200).send("created")
        acceptTodo(data._id,request.userID,"accept")
    })
    
})

// 修改todo
router.patch("/",async(request,response)=>{
    // 如果不是自己的 拒绝修改
    let ori_owner = (await todoModel.findOne({_id:request.body.id})).creatorID
    if(ori_owner != request.userID){
        response.status(409).send("not your todo")
        return
    }
    
    // 把执行者放进去
    const memberList = []
    request.body.memList.forEach((item)=>{
        memberList.push({
            userID:item,
            attitude:"waiting"
            
        })
    })

    todoModel.updateOne({
        _id:request.body.id
    },{
        content: request.body.content,
        startTime: String(new Date(request.body.startTime)),
        endTime: String(new Date(request.body.endTime)),
        member: memberList,
        creatorID: request.userID
    }).then(()=>{
        response.status(200).send("updated")
    })
})

// 获取所有和我有关的
router.get("/",async (request,response)=>{
    const result = []
    // 找到所有要我参与的
    result.push(...(await todoModel.find({"member.userID":request.userID})) )
    // 找到所有我创建的
    result.push(...(await todoModel.find({"creatorID":request.userID})))

    response.status(200).json(result)
})

// 获取我创建的
router.get("/mine",async(request,response)=>{
    response.status(200).json(await todoModel.find({"creatorID":request.userID}))
})

// 获取别人的 只能获取到时间
router.get("/others", async (request, response) => {
    const todoList = await todoModel.find({
        member: {
            $elemMatch: {
                userID: request.query.id,
                attitude: "accept"
            }
        }
    }).select("-content -member")
    response.status(200).json(todoList)
})

// 删除 如果是自己创建的，直接在数据库删，如果只是参与 把member上自己的attitude改成delete
router.delete("/",async(request,response)=>{
    let ori_owner=''
    try{
        ori_owner = (await todoModel.findOne({_id:request.query.id})).creatorID
    }
    catch{
        response.status(404).send("NotFound")
        return
    }
    
    if(ori_owner == request.userID){  // 如果是自己的
        todoModel.deleteOne({_id:request.query.id}).then(()=>{
            response.status(200).send("OK")
        })
    }else{
        await todoModel.updateOne({
            _id: request.query.id,
            "member.userID": request.userID
        },{
            $set: {
                "member.$.attitude": "delete"
            }
        }).then((data)=>{
            response.status(200).send("OK")
        })   
    }
})

// 用来接受或者拒绝的函数
async function acceptTodo(todoID, userID,attitude) {
    return await todoModel.updateOne(
        {
            _id: todoID,
            member: {
                $elemMatch: {
                    userID: userID,
                    attitude: "waiting"
                }
            }
        },
        {
            $set: {
                "member.$.attitude": attitude
            }
        }
    )
}

// 接受或者拒绝 Todo
router.post("/attitude", async (request, response) => {
    const result = await acceptTodo(
        request.body.todoID,
        request.userID,
        request.body.attitude
    )

    if (result.modifiedCount === 1) {
        response.status(200).send("OK")
    } else {
        response.status(409).send("操作失败")
    }
})

// 用来接受或拒绝todo
// 获取所有我已经接受的 Todo
router.get("/confirm", async (request, response) => {
    const result = await todoModel.find({
        member: {
            $elemMatch: {
                userID: request.userID,
                attitude: "accept"
            }
        }
    })
    response.status(200).json(result)
})

// 等我操作
router.get("/waiting", async (request, response) => {
    const result = await todoModel.find({
        member: {
            $elemMatch: {
                userID: request.userID,
                attitude: "waiting"
            }
        }
    })

    response.status(200).json(result)
})


module.exports = router