const mongoose = require('mongoose')
const { Schema, Types } = mongoose

const ViewedSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'users', indexes: 1 },
    video: { type: Types.ObjectId, ref: 'videos', indexes: 1 },
    last_update: { type: Date, default: Date.now }
})
module.exports = mongoose.model('vieweds', ViewedSchema)
