const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: true,
        required: true
    },
    permissionList: Array
})

const permissionGroupModel = mongoose.model('permission_Group',groupSchema)
module.exports = permissionGroupModel