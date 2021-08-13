'use strict'

const BidOrdersService = require('../../services/bid-order')
const BuysService = require('../../services/buy')

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

  static async getTopSellerQuantity (_req, _res) {
    try {
      const params = _req.query
      const {
        limit = 10
      } = params
      const data = await BidOrdersService.getTopSeller({ limit })
      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getTopSellerRevenue (_req, _res) {
    try {
      const params = _req.query

      const {
        limit = 10
      } = params

      const data = await BuysService.getTopSeller({ limit })

      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
