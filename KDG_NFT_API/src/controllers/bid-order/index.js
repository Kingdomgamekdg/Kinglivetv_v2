'use strict'

const BidOrderService = require('../../services/bid-order')
const UserService = require('../../services/user')
const { IsEmpty } = require('../../utils/common-util')

module.exports = class {
  static async getTotalTransactions (_req, _res) {
    try {
      const queries = _req.query

      const { ...conditions } = queries

      const total = await BidOrderService.count(conditions)

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getBiddingOfUser (_req, _res) {
    try {
      const {
        _id: userId
      } = _req

      const user = await UserService.findById(userId, '_id')

      if (IsEmpty(user)) {
        _res.status(200).json({ status: 1, data: [] })
      }

      const queries = _req.query

      const { ...conditions } = queries

      conditions.from = userId

      if (!conditions.status) {
        conditions.status = 0
      }

      const orders = await BidOrderService.find(conditions)
        .populate({
          path: 'from',
          populate: {
            path: 'kyc.avatar uploads'
          }
        })
        .populate({
          path: 'list_id'
        })
        .populate({
          path: 'asset'
        })
      _res.status(200).json({
        data: orders
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
