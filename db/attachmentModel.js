const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    fileName: String,
    uploaderID: String,
    time: String,
    originalFilename: String

})

const model = mongoose.model('attachment',schema)
module.exports = model