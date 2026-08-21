const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    attacmentPath: Array,
    timeline: Array,
    status: String,
    finishData: String,
    comments: Array,
})

const model = mongoose.model('approval',schema)
module.exports = model