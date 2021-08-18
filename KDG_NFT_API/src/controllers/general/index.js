'use strict'

const BuysService = require('../../services/buy')

module.exports = class {
  static async getTotalTraders (_req, _res) {
    try {
      const total = await BuysService.count({
        status: 1
      })

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getTopSellerQuantity (_req, _res) {
    try {
      const queries = _req.query

      const {
        limit
      } = _req.paging

      const { ...conditions } = queries

      if (!conditions.status) {
        conditions.status = 1
      }
      const type = 'quantity'
      const data = await BuysService.getTopSeller(conditions, type, limit)
      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getTopSellerRevenue (_req, _res) {
    try {
      const queries = _req.query

      const {
        limit
      } = _req.paging

      const { ...conditions } = queries
      const type = 'payment_amount'
      const data = await BuysService.getTopSeller(conditions, type, limit)

      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
