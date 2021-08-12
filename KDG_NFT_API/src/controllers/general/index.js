'use strict'

const BidOrdersService = require('../../services/bid-orders')
const BuysService = require('../../services/buys')

module.exports = class {
  static async getTotalTraders (_req, _res) {
    try {
      const totalBidOrders = await BidOrdersService.count({
        status: 2
      })

      const totalBuys = await BuysService.count({
        status: 1
      })

      const total = totalBidOrders + totalBuys

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
