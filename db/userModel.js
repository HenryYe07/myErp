const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    permissionGroup: Array,
    memID: String,
    realName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    tokenVersion: Number,

})
const userModel = mongoose.model('Users',userSchema)
module.exports = userModel