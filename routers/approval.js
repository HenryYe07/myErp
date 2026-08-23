const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const {getID} = require('../modules/getUsername_id_tool')
const mongoose = require('mongoose')
// 登陆状态检测和权限控制的中间件
const auth_MW = require("../middleware/auth") // 直接auth_MW 使用
const permission_Verify_MW = require("../middleware/permission_Verify") // permission_Verify_MW("<权限名称>")

const serverKey = 'oooooiiiskskkkskks12348765'

const approvalModel = require('../db/approvalModel')
const { request } = require('http')
router.post("/new",auth_MW,permission_Verify_MW("approval.create"),(async(request,response)=>{

    let defaultTimeline = []

    // 创建人的信息 作为第一个
    defaultTimeline.push({
        nodeUserID: request.userID,
        status: "created",
        operateTime:String(new Date())
    })

    // 后续节点的信息
    for(index in request.body.approvers){
        defaultTimeline.push({
            nodeUserID: String(await getID(request.body.approvers[index])),
            status: "waiting",
            operateTime:""
        }) 
    }

    console.log(defaultTimeline)
    

    let new_approval_Obj = {
        title: request.body.title,
        content: request.body.content,
        attachmentPath: request.body.attachmentName,
        timeline:defaultTimeline,
        status: "ongoing",
        comments:[]
    }
    console.log(new_approval_Obj)

    await approvalModel.create(new_approval_Obj)
    
    response.send("OK")
}))


// 所有我创建的审批
router.get("/myApprovals",auth_MW,permission_Verify_MW("approval.create"),(request,response)=>{
    approvalModel.find({"timeline.nodeUserID":request.userID}).then((data)=>{
        let my_CreatedApprovals = []
        data.forEach((item)=>{
            if(item.timeline[0].nodeUserID == request.userID){
                my_CreatedApprovals.push(item)
            }
        })
        response.status(200).json(my_CreatedApprovals)
        
    })
})

// 所有和我有关的审批
router.get("/throughApproval",auth_MW,permission_Verify_MW("approval.process"),(request,response)=>{
    approvalModel.find({"timeline.nodeUserID":request.userID}).then((data)=>{
        response.status(200).json(data)
    })
})

// 撤回审批 (总状态必须是ongoing) 肯定是从列表那过来删除的，此时前端肯定拿到id了
router.post("/recall",auth_MW,(request,response)=>{
    approvalModel.updateOne({
        "_id": request.body.id,
        "status": "ongoing",
        "timeline.0.nodeUserID":request.userID,
    },{
        "status": "recalled",
        "timeline.0.status": "recalled",
        "timeline.0.operateTime": String(new Date())
    }).then((data)=>{
        if(data.modifiedCount == 1){
            console.log(data)
            response.status(200).send("ok")
        }
        else{
            response.status(409).send("fail")
        }
        
    })
})

// 返回在等我的
router.get('/waitingMe',auth_MW,permission_Verify_MW("approval.process"),async (request,response)=>{
    // 从数据库把所有和我有关的 并且ongoing的拿回来
    let wtMe_list = await approvalModel.find({"timeline.nodeUserID":request.userID})


    wtMe_list = wtMe_list.filter((item_wtMe)=>{
        
        const myIndex = item_wtMe.timeline.findLastIndex(item => item.nodeUserID==request.userID)

        if(myIndex == 0){
            return false
        }

        console.log(item_wtMe.title,myIndex)

        console.log((item_wtMe.timeline[myIndex].status == 'waiting'))
        console.log((item_wtMe.timeline[myIndex-1].status == 'accepted' || item_wtMe.timeline[myIndex-1].status == 'created'))
        console.log((item_wtMe.status == 'ongoing'))
        if( // 前面的人同意了 现在我是等待状态 整个审批是ongoing状态
            (item_wtMe.timeline[myIndex].status == 'waiting')&&
            (item_wtMe.timeline[myIndex-1].status == 'accepted' || item_wtMe.timeline[myIndex-1].status == 'created')&&
            (item_wtMe.status == 'ongoing')
        ){
            console.log("有")
            return true
        }else{
            return false
        }
    })

    response.status(200).json(wtMe_list)
    
    console.log(wtMe_list)

})



// 处理审批 自己的上一个必须已经完成
router.post("/process",auth_MW,permission_Verify_MW("approval.process"),async (request,response)=>{
    let processing_obj = await approvalModel.findOne({_id:request.body.processID})
    console.log(processing_obj)
    const myIndex = processing_obj.timeline.findLastIndex(item => item.nodeUserID==request.userID)
    if(myIndex == -1){
        response.status(403).send("not your or your related approval")
        return
    }

    if( // 前面的人同意了 现在我是等待状态 整个审批是ongoing状态
        (processing_obj.timeline[myIndex].status == 'waiting')&&
        (processing_obj.timeline[myIndex-1].status == 'accepted' || processing_obj.timeline[myIndex-1].status == 'created')&&
        (processing_obj.status == 'ongoing')
    ){ // 把timeline上自己的信息填好
        processing_obj.timeline[myIndex].status = request.body.suggest
        processing_obj.timeline[myIndex].operateTime = String(new Date())
    }else{
        console.log((processing_obj.timeline[myIndex].status == 'waiting'),(processing_obj.timeline[myIndex-1].status == 'accepted' || processing_obj.timeline[myIndex-1].status == 'created'),(processing_obj.status == 'ongoing'))

        response.status(400).send("No need to process Now")
        console.log(myIndex)
        return
    }
    
    // 如果rejected 把总状态也改成拒绝
    if(request.body.suggest == "rejected"){
        processing_obj.status = "rejected"
    }

    // 如果时间线上只有created和accepted状态了，就把总状态改成finishied
    let is_finished = 1
    for(let item of processing_obj.timeline){
        if(!(item.status == 'created' || item.status == 'accepted')){
            is_finished = 0
        }
    }
    if(is_finished){
        processing_obj.status = "finished"
    }

    console.log(processing_obj)

    approvalModel.updateOne({_id:request.body.processID},processing_obj).then((data)=>{
        console.log(data)
        response.status(200).send("OK")
    })//

})

// 根据审批id获取单个审批
router.get("/",auth_MW,async (request,response)=>{
    let aprID = request.query
    if(request.query.id == ""){
        return
    }
    let aprObj = await approvalModel.findOne({_id:request.query.id})
    response.status(200).json(aprObj)
})




const approvalCommentModel = require("../db/approvalCommentModel")

router.post("/comment",auth_MW,(request,response)=>{
    commentObj = {
        forApprovalID: String(request.body.approvalID),
        content: request.body.content,
        userID: request.userID,
        time: String(new Date())
    }
    approvalCommentModel.create(commentObj).then(()=>{
        response.status(201).send("comment Posted")
    })
})

router.delete("/comment",auth_MW,async (request,response)=>{
    let cmt_owner = (await approvalCommentModel.findOne({_id:request.body.commentID})).userID
    if(request.userID == cmt_owner){
        approvalCommentModel.deleteOne({_id:request.body.commentID}).then((data)=>{
            response.status(200).send("comment deleted")
        })
    }else{
        response.status(403).send("not Your comment")
    }
})


router.post("/commentOfApproval",auth_MW,(req,res)=>{
    approvalCommentModel.find({forApprovalID:req.body.approvalID}).then((data)=>{
        res.status(200).json(data)
    })
})

module.exports = router