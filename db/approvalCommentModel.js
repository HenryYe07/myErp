const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    forApprovalID: String,
    content: String,
    userID: String,
    time: String
})

const model = mongoose.model('approvalComment',schema)
module.exports = model