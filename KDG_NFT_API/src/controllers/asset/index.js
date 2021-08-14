'use strict'

const AssetService = require('../../services/asset')

module.exports = class {
  static async getTotalAssets (_req, _res) {
    try {
      const queries = _req.query
      const { ...conditions } = queries
      if (queries.mimetype) {
        const mimetype = queries.mimetype.split(',').map(i => i.trim())
        conditions['metadata.mimetype'] = {
          $in: mimetype
        }
        delete conditions.mimetype
      }

      const totalAssets = await AssetService.count(conditions)

      _res.status(200).json({
        total: totalAssets || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
