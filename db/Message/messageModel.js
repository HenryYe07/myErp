const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    chatID: String,
    senderUserID: String,
    content: String,
    type:String, //text pic file recalled
    time:String,
    is_socketSent:Boolean // 其实这个没有用
})

const model = mongoose.model('message',schema)
module.exports = model