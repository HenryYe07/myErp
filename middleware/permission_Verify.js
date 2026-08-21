// 这个东西一定要接在auth后面用
const mongoose = require("mongoose")

const userModel = require("../db/userModel")
const permissionGroupModel = require('../db/permissionGroupModel')
module.exports = (required_permission)=>{
    return async(request,response,next)=>{
        const userID = request.userID
        // console.log("访问的用户ID是",userID)
        let user_groupList = await userModel.findOne({_id:userID})
        user_groupList = user_groupList.permissionGroup

        let permissions_inItem
        let all_pms = []
        for(let item of user_groupList){
            let found_pms = await permissionGroupModel.findOne({groupName:item})
            try{found_pms = found_pms.permissionList}catch{console.log("一个不存在的组被读取了")}
            all_pms.push(...found_pms)
        }
        // console.log(all_pms)
        if(all_pms.includes(required_permission)){
            next()
        }
        else{
            response.status(403)
            response.send('No Permission')
            
        }
    }   
}
