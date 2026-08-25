
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')

const serverKey = 'oooooiiiskskkkskks12348765'
const mailModel = require("../db/mail/mailModel")


router.post("/",(request,response)=>{
    // 异常处理
    if(request.body.title == ''){
        response.status(420).send("必须有标题");
        return
    }
    if(request.body.mainRcvID.length == 0){
        response.status(421).send("必须有主收件人");
        return
    }

    const receivers = []
    // 主收件人
    request.body.mainRcvID.forEach((item)=>{
        receivers.push({
            userID:item,
            type:"main",
            is_read:false
        })
    })
    // 抄送收件人
    request.body.copyRcvID.forEach((item)=>{
        receivers.push({
            userID:item,
            type:"copy",
            is_read:false
        })
    })


    const mailObj = {
        senderUserID: request.userID,
        title: request.body.title,
        quoteMailID: request.body.quoteMailID,
        content: request.body.content,
        type: request.body.type,
        time: String(new Date()),
        attachmentList:request.body.attachmentList,
        receivers: receivers

    }
    
    // 存进数据库 然后在线的话ws喊一声
    mailModel.create(mailObj).then(() => {
    response.status(200).send('OK')

    // 向在线收件人发送新邮件通知
    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) {
            return
        }

        const isReceiverOnline = receivers.some((receiver) => {
            return String(receiver.userID) === String(client.userID)
        })

        if (isReceiverOnline) {
            client.send("gotNewMessage")
        }
    })
})
    
})

router.get("/list", async (request, response) => {
    const count_perTme = 10 // 每一次请求允许拿到的数量

    const box = request.query.box || undefined
    const roll = request.query.roll || undefined
    const type = request.query.type || undefined
    const is_read = request.query.is_read || undefined

    // 默认第 1 页
    const page = Math.max(parseInt(request.query.page) || 1, 1)

    // 参数检查
    if (box !== "snt" && box !== "rcv") {
        response.status(400).send("box参数必须是snt或rcv")
        return
    }

    if (
        type !== undefined &&
        !["all", "notice", "discuss", "asking", "uncertain"].includes(type)
    ) {
        response.status(400).send("type参数无效")
        return
    }

    // roll 只有收件箱需要
    if (
        box === "rcv" &&
        roll !== undefined &&
        !["main", "copy"].includes(roll)
    ) {
        response.status(400).send("roll参数必须是main或copy")
        return
    }

    // is_read 只有收件箱需要
    if (
        box === "rcv" &&
        is_read !== undefined &&
        !["all", "true", "false"].includes(is_read)
    ) {
        response.status(400).send("is_read参数必须是all、true或false")
        return
    }

    const query = {}

    // 发件箱

    if (box === "snt") {

        // 当前用户是发件人
        query.senderUserID = request.userID

    }

    // 收件箱
    else {

        const receiverCondition = {
            userID: request.userID
        }

        // 主送 / 抄送
        if (roll !== undefined) {
            receiverCondition.type = roll
        }

        // 已读 / 未读
        if (is_read === "true") {
            receiverCondition.is_read = true
        }
        else if (is_read === "false") {
            receiverCondition.is_read = false
        }

        query.receivers = {
            $elemMatch: receiverCondition
        }
    }

    // =========================
    // 邮件类型
    // =========================

    // all 表示不筛选
    if (
        type !== undefined &&
        type !== "all"
    ) {
        query.type = type
    }

    // 查询数据库

    try {

        const mailList = await mailModel
            .find(query)
            .select("-content")
            .sort({ _id: -1 })
            .skip((page - 1) * count_perTme)
            .limit(count_perTme)
            

        response.status(200).json(mailList)

    }
    catch (err) {

        console.error(err)

        response.status(500).send("获取邮件列表失败")
    }
})

router.get("/", async (request, response) => {
    try {
        const mailID = String(request.query.mailID)

        const mailObj = await mailModel.findById(mailID)

        // 邮件不存在
        if (!mailObj) {
            response.status(403).send("not allowed")
            return
        }

        // 当前用户是否为发件人
        const isSender =
            String(mailObj.senderUserID) === String(request.userID)

        // 当前用户是否在收件人列表
        const isReceiver = mailObj.receivers.some((item) => {
            return String(item.userID) === String(request.userID)
        })

        // 既不是发件人，也不是收件人
        if (!isSender && !isReceiver) {
            response.status(403).send("not allowed")
            return
        }

        // 允许访问
        response.status(200).json(mailObj)
    }
    catch (err) {
        console.error(err)
        response.status(500).send("获取邮件失败")
    }
})


const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 9090 })

wss.on("connection", async (client, request) => {
    try {
        // 从 Cookie 中获取 token
        const cookie = request.headers.cookie || ""

        const tokenCookie = cookie
            .split(";")
            .map(item => item.trim())
            .find(item => item.startsWith("token="))

        // 没有 token，直接关闭连接
        if (!tokenCookie) {
            client.close()
            return
        }

        const token = tokenCookie.substring("token=".length)

        // JWT 验证
        const data = jwt.verify(token, serverKey)

        // 查询用户
        const db_userinfo = await userModel.findById(data.id)

        // 用户不存在，或者 tokenVersion 不一致
        if (
            !db_userinfo ||
            data.tokenVersion != db_userinfo.tokenVersion
        ) {
            client.close()
            return
        }

        // 鉴权成功，把用户 ID 放进 client
        client.userID = String(data.id)

        console.log("WebSocket用户上线", client.userID)

        // 用户断开连接
        client.on("close", () => {
            console.log("WebSocket用户下线", client.userID)
        })
    }
    catch (err) {
        console.error(err)
        client.close()
    }
})
module.exports = router