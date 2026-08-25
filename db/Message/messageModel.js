const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    chatID: String,
    senderUserID: String,
    content: String,
    type:String, //text pic file recalled
    time:String,
    is_socketSent:Boolean
})

const model = mongoose.model('message',schema)
module.exports = model