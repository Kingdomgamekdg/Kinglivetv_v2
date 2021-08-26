const mongoose = require('mongoose')
const { Schema, Types } = mongoose

const transactionSchema = new Schema({
  type: { type: Number, require: true }, // loại giao dịch 1: referral, 2: livestream, 3: watching, 4: mint
  from: { type: Types.ObjectId, ref: 'users' }, //thông tin user gửi điểm,
  to: { type: Types.ObjectId, ref: 'users' },//thông tin user nhận điểm,
  value: { type: Number, require: true }, // giá trị giao dịch
}, {
  timestamps: true
})

const Transactions = mongoose.model('transactions', transactionSchema)

module.exports = Transactions