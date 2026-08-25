const express = require('express')

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/myErpDB").then(()=>{
    console.log('mongoDB connected')
})
const server = express()

// 给body添加json解析
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
server.use(jsonParser)

// 登陆状态检测和权限控制的中间件
const auth_MW = require("./middleware/auth") // 直接auth_MW 使用
const permission_Verify_MW = require("./middleware/permission_Verify") // permission_Verify_MW("<权限名称>")


const cookieParser = require("cookie-parser")
server.use(cookieParser())

// 引入账号api模块
const accountRouter = require(__dirname+"/routers/account.js")
server.use('/api/account',accountRouter)

// 引入系统管理员 api模块
const admin = require("./routers/admin.js")
server.use('/api/admin',admin)

// 引入审批api模块
const approval = require("./routers/approval.js")
server.use('/api/approval',approval)

// 引入文件上传api模块
const attachment = require("./routers/attachment.js")
server.use('/api/attachment',auth_MW,attachment)

// 引入工具模块
const tools = require("./routers/tools.js")
server.use('/api/tools',tools)

server.get('/',(request,response)=>{
    console.log('get')
    response.send("OK")
})

// 引入todo模块
const todo = require("./routers/todo.js")
server.use('/api/todo',auth_MW,todo)

// 引入message模块
const message = require("./routers/message.js")
server.use('/api/message',auth_MW,message)

server.listen(9000,()=>{
    console.log('Http server launched: ','http://127.0.0.1:9000/')
})