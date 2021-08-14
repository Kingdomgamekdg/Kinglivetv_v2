'use strict'

const BidOrderService = require('../../services/bid-order')

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
}
