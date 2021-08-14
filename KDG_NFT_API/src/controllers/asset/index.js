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

  static async getAsset (_req, _res) {
    try {
      const queries = _req.query
      const ids = queries.ids ? queries.ids.split(',') : []

      const asset = await AssetService.find({_id : {$in : queries.ids}}).populate({
        path : 'owner',
      })

      _res.status(200).json({
        status:1,
        data: asset
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
