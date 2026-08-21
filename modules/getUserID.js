const userModel = require("../db/userModel")
async function getID(username){
    var id;
    try{
        id = await userModel.findOne({"username":username}) || await userModel.findOne({"memID":username})
        id = id["_id"]
    }catch(err){
        id = null
    }
    console.log(id)
    return id
}
module.exports = getID