const mongoose = require('mongoose');
const {Schema} = mongoose;

const uploadsSchema = new Schema({
    path:String,
    type: Number,
})

module.exports = mongoose.model('uploads', uploadsSchema);