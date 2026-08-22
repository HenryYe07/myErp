const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    content: String,
    startTime: String,
    endTime: String,
    member: Array
})

const model = mongoose.model('todo',schema)
module.exports = model