'use strict'

const BidOrderService = require('../../services/bid-order')

module.exports = class {
  static async getTotalTransactions (_req, _res) {
    try {
      const params = _req.query

      const condition = {}

      if (params.status) {
        condition.status = params.status
      }

      const total = await BidOrderService.count(condition)

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
