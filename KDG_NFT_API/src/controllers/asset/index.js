'use strict'

const AssetService = require('../../services/asset')

module.exports = class {
  static async getTotalAssets (_req, _res) {
    try {
      const queries = _req.query

      const condition = {}
      if (queries.mimetype) {
        const mimetype = queries.mimetype.split(',').map(i => i.trim())
        condition['metadata.mimetype'] = {
          $in: mimetype
        }
      }
      const totalAssets = await AssetService.count(condition)

      _res.status(200).json({
        total: totalAssets || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}