const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    member: Array,
    title: String,
    createrID:String,
})


const model = mongoose.model('chat',schema)

module.exports = model