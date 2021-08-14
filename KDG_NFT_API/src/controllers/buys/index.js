'use strict'

const BuysService = require('../../services/buy')

module.exports = class {
  static async getTotalAssetVolume (_req, _res) {
    try {
      const params = _req.query

      const condition = {}

      if (params.status) {
        condition.status = params.status || 1
      }

      const totalVolume = await BuysService.getTotalAssetVolume(condition)

      _res.status(200).json({
        total: totalVolume.length ? totalVolume[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
