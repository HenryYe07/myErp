const serverKey = 'oooooiiiskskkkskks12348765'
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userModel = require('../db/userModel')

module.exports =function(request,response,next){
    jwt.verify(request.cookies.token,serverKey,(err,data)=>{
        if(err){
            response.status(403)
            response.send('Login statu error')
            return
        }
        else{
            userModel.find({_id:data.id}).then((db_userinfo)=>{
                jwt.verify(request.cookies.token,serverKey,(err,data)=>{

                // 处理登陆/账户本身的异常
                if(err || !db_userinfo || data.tokenVersion != db_userinfo[0].tokenVersion){
                    response.status(403)
                    response.send('Login statu error')
                    return
                }

                if(data.tokenVersion == db_userinfo[0].tokenVersion){
                    request.userID = data.id
                    next()
                }
            })
            })
        }
    })
}