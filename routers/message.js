// @ts-check
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')

const serverKey = 'oooooiiiskskkkskks12348765'
const chatModel = require('../db/Message/chatModel')
const messageModel = require("../db/Message/messageModel")

// 发消息
router.post('/',(request,response)=>{
    const messageObj = {
        chatID: request.body.chatID,
        senderUserID: request.userID,
        content: request.body.content,
        time: String(new Date()),
        type: request.body.type,
        is_socketSent: false
    }
    messageModel.create(messageObj).then(()=>{
        response.status(200).send("OK")
    })
    
})
// 撤回消息
router.patch("/",async(request,response)=>{
    // 先找出来
    let msgObj = await messageModel.findOne({_id:request.query.id})
    console.log(msgObj)

    // 判断请求的id对不对
    if(!msgObj){
        response.status(405).send("Value not fulfilled")
        return
    }
    
    // 判断是不是自己的
    if(msgObj.senderUserID != request.userID){
        response.status(401).send("You can only recall your own message")
        return
    }
    
    // 判断有没有超过三分钟
    const now = new Date()
    const msgTime = new Date(msgObj.time)
    if (now.getTime() - msgTime.getTime() > 3 * 60 * 1000) {
        response.status(402).send("You can only recall your message within 3 minuts")
        return
    }

    messageModel.updateOne({_id:request.query.id},{
        content:"---撤回了一条消息---",
        type:"recalled"
    }).then(()=>{
        response.status(200).send("OK")
    })
})

// 要传入之前拿到的最后一条消息的id 如果没有，则传输最晚的20条
router.get('/',(request,response)=>{

    // 要求传入数量 最后一条消息的id chatID
    if(!(request.query.amount && request.query.chatID)){
        response.status(400).send("values not fulfilled")
        return
    }
    
    messageModel.find({

        chatID: String(request.query.chatID),

        ...((request.query.lastmsgID && (request.query.lastmsgID!=""))?
            {_id:{$lt:new mongoose.Types.ObjectId(String(request.query.lastmsgID))}}
            :
            {}
        )

    }).sort({_id:-1}).limit(Number(request.query.amount)).then((res)=>{
        response.status(200).json(res.reverse())
    })
})

// 创建对话
router.post('/chat',(request,response)=>{
    if(request.body.memList == ""||request.body.title == ""){
        response.status(400).send("Not fulfilled")
        return
    }
    chatModel.create({
        member: request.body.memList,
        title: request.body.title,
        createrID:request.userID
    }).then((res)=>{
        console.log(res)

        // 发一个初始消息
        const messageObj = {
        chatID: String(res._id),
        senderUserID: "系统",
        content: "新的聊天成功创建",
        time: String(new Date()),
        type: "text",

        }
        messageModel.create(messageObj).then(()=>{
            response.status(200).send("OK")
        })

    })
    
})

// 编辑会话
router.put('/chat',(request,response)=>{
    if(request.body.memList == ""||request.body.title == "" || request.body.id==""){
        response.status(400).send("Not fulfilled")
        return
    }
    chatModel.updateOne({
            _id:request.body.id
        },{
        member: request.body.memList,
        title: request.body.title,
        createrID:request.userID
    }).then((res)=>{
        if (res.matchedCount === 0) {
            response.status(404).send("chat not found")
            return
        }

        const messageObj = {
        chatID: String(request.body.id),
        senderUserID: "系统",
        content: "请注意，会话的标题或人员进行了修改",
        time: String(new Date()),
        type: "text",

        }
        messageModel.create(messageObj).then(()=>{
            response.status(200).send("OK")
        })

    })
    
})

// 获取我的会话列表
router.get('/chat',(request,response)=>{
    chatModel.find({member:String(request.userID)}).then((res)=>{
        response.status(200).json(res)
    })
})
module.exports = router