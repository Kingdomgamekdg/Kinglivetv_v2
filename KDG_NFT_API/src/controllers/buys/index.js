'use strict'

const BuysService = require('../../services/buy')

module.exports = class {
  static async getTotalAssetVolume (_req, _res) {
    try {
      const queries = _req.query

      const { ...conditions } = queries

      if (!conditions.status) {
        conditions.status = 1
      }

      const totalVolume = await BuysService.getTotalAssetVolume(conditions)

      _res.status(200).json({
        total: totalVolume.length ? totalVolume[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
