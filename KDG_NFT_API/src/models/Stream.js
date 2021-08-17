const mongoose = require('mongoose')
const { Schema, Types } = mongoose

const StreamSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'users' },
    status: { type: Number, default: 0 }, // 0 = đang settup , 1 = đang live , 2 = đã kết thúc
    connect_status: { type: Number, default: 0 }, // 0 = chưa kết nối , 1 = đã kết nối
    key: { type: String, indexes: 1 },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: [{ type: String, default: [] }],
    views: { type: Number, default: 0 },
    thumbnail: { type: Types.ObjectId, ref: 'uploads' },
    create_date: { type: Date, default: Date.now },
    start_date: { type: Date },
    end_date: { type: Date },
    length: { type: Number, default: 0 },
    last_start: { type: Date },
    viewing: { type: Number, default: 0 }
})

module.exports = mongoose.model('streams', StreamSchema)
