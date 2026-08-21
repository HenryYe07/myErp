const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const getIDbyUserName = require('../modules/getUserID')

const auth_MW = require("../middleware/auth") // 直接auth_MW 使用


const serverKey = 'oooooiiiskskkkskks12348765'

router.get("/getUsername",auth_MW,(request,response)=>{

    userModel.findOne({_id:request.query.id}).then((result)=>{
        if(!result){
            response.status(404).send("notFound")
            return
        }
        response.status(200).send(result.username)

    })
})

router.get('/getUserByAnyWord', auth_MW, async (request, response) => {
    const find = String(request.query.find ?? '').trim()
    const result = await userModel.find({
    $or: [
        { username: { $regex: find, $options: 'i' } },
        { memID: { $regex: find, $options: 'i' } },
        { realName: { $regex: find, $options: 'i' } }
    ]
    }).select('-password').select('-permissionGroup').select('-permissionGroup').select("-tokenVersion")

response.status(200).json(result)
})

module.exports = router