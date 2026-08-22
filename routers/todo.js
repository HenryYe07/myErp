const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const getIDbyUserName = require('../modules/getUserID')

const serverKey = 'oooooiiiskskkkskks12348765'

const todoModel = require("../db/todoModel")

router.post("/",(request,response)=>{
    const memberList = []
    memberList.push({
        userID:request.userID,
        attitude:"creator"
    })
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
        member: memberList
    }).then(()=>{
        response.status(200).send("created")
    })
})

router.patch("/",(request,response)=>{
    const memberList = []
    memberList.push({
        userID:request.userID,
        attitude:"creator"
    })
    request.body.memList.forEach((item)=>{
        memberList.push({
            userID:item,
            attitude:"waiting"
            
        })
    })
    todoModel.update({
        _id:request.body.id
    },{
        content: request.body.content,
        startTime: String(new Date(request.body.startTime)),
        endTime: String(new Date(request.body.endTime)),
        member: memberList
    }).then(()=>{
        response.status(200).send("created")
    })
})


module.exports = router