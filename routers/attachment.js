// 接受文件上传的东西
const {formidable} = require("formidable")
// 数据库操作
const mongoose = require('mongoose')

const express = require('express')
const router = express.Router()
const attachmentModel = require("../db/attachmentModel")
const permission_Verify_MW = require("../middleware/permission_Verify") // permission_Verify_MW("<权限名称>")
const fs = require("fs")
router.post('/',permission_Verify_MW("attach.upload"),function(req,res){
    const form = formidable({
        multiples: true,
        // 指定保存位置
        uploadDir: '/Users/henryye/Desktop/myERP/public/upload',
        // 保留文件后缀
        keepExtensions:true
  });

  form.parse(req, async(err, fields, files) => {
    if (err) {
        res.status(400)
        res.send("Fail to upload file")
        console.log("错误情况：",err)
        return
    }
    res.status(201)
    res.json({ fields, files })

    console.log(fields)
    console.log(files)

    for(let index in files['uploadFile']){
      let itemNow = files['uploadFile'][index]
      console.log(itemNow.newFilename)
      let writeDb_obj = {
        fileName:itemNow.newFilename,
        uploaderID:req.userID,
        time: new Date(),
        originalFilename:itemNow.originalFilename
      }
      console.log(writeDb_obj)
      await attachmentModel.create(writeDb_obj)
    }


  })
})

router.use(express.static("/Users/henryye/Desktop/myERP/public/upload"))

router.get("/allMyFiles",permission_Verify_MW("attach.upload"),(request,response)=>{
  attachmentModel.find({uploaderID:request.userID}).then((data)=>{
    response.status(200)
    response.json(data)
  })
})

// 一个用来判断能不能删除的 中间件函数
function isOwn(request,response,next){
  attachmentModel.find({
    uploaderID:request.userID,
    fileName: request.body.deleteFileName
  }).then((data)=>{
    if(data.length==1){
      next()
    }
    else{
      response.status(403).send("CANNOT RM THIS")
      return
    }
  })
  

}


router.delete('/',permission_Verify_MW("attach.delete.own"),isOwn,(request,response)=>{
  
  filename = request.body.deleteFileName
  fs.rm("/Users/henryye/Desktop/myERP/public/upload/"+filename,(err)=>{
    if(err){
      response.status(400).send("fail of fs")
      return
    }
    attachmentModel.deleteOne({fileName:filename}).then((result)=>{
      if(result.deletedCount == 1){
        response.status(200).send("删除成功")
        return
      }
      else{
        response.status(400).send("fail of db")
      }
    })
  })
})

router.delete('/any',permission_Verify_MW("attach.delete.own"),(request,response)=>{
  
  filename = request.body.deleteFileName
  fs.rm("/Users/henryye/Desktop/myERP/public/upload/"+filename,(err)=>{
    if(err){
      response.status(400).send("fail of fs")
      return
    }
    attachmentModel.deleteOne({fileName:filename}).then((result)=>{
      if(result.deletedCount == 1){
        response.status(200).send("删除成功")
        return
      }
      else{
        response.status(400).send("fail of db")
      }
    })
  })
})
module.exports = router