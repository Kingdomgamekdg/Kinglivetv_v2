const mongoose = require('mongoose')
const { Schema, Types } = mongoose

const VideosSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'users' },
    name: { type: String },
    description: { type: String },
    views: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    duration: { type: Number },
    guid: { type: String },
    short_id: { type: String },
    create_date: { type: Date, default: () => new Date() },
    status: { type: Number, default: 0 },
    thumbnail: { type: Types.ObjectId, ref: 'uploads' },
    type: { type: Number, default: 1 },
    tags: [{ type: String, default: [] }],
    stream: { type: Types.ObjectId, ref: 'streams' }
})
// Videos.updateMany({} , {}).exec()
module.exports = mongoose.model('videos', VideosSchema)
