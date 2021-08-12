const mongoose = require('mongoose')
const { Schema, Types } = mongoose

const FollowsSchema = new Schema({
    follower: { type: Types.ObjectId, ref: 'users' }, // người đang theo dõi
    followed: { type: Types.ObjectId, ref: 'users' }, // người được theo dõi
    create_date: { type: Date, default: Date.now }
})
mongoose.model('follows', FollowsSchema)
