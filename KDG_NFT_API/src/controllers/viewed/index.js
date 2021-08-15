'use strict'
const ViewedService = require('../../services/viewed')

module.exports = class {
  static async getTotalViewed (_req, _res) {
    try {
      const queries = _req.query

      const { ...conditions } = queries

      const totalVideos = await ViewedService.count(conditions)

      _res.status(200).json({
        total: totalVideos || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
