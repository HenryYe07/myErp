const userModel = require("../db/userModel")
async function getID(username){
    let id;
    try{
        id = await userModel.findOne({"username":username}) || await userModel.findOne({"memID":username})
        id = id["_id"]
    }catch(err){
        id = null
    }
    console.log(id)
    return id
}


async function getUsernameByID(userID){
    let username

    try{
        username = await userModel.findOne({ "_id": userID })
        username = username["username"]
    }catch(err){
        username = null
    }

    console.log(username)
    return username
}

module.exports = {getUsernameByID,getID}