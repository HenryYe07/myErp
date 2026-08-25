const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    senderUserID: String,
    title: String,
    quoteMailID:String,
    content: String,
    type:String, // notice discuss asking uncertain
    time:String,
    attachmentList:Array,
    receivers:Array,
    
})

const model = mongoose.model('mails',schema)
module.exports = model