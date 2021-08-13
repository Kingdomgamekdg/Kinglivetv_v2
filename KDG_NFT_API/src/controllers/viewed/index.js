'use strict'
const ViewedService = require('../../services/viewed')

module.exports = class {
  static async getTotalViewed (_req, _res) {
    try {
      const queries = _req.query

      const condition = {}

      if (queries.status) {
        condition.status = queries.status
      }

      const totalVideos = await ViewedService.count(condition)

      _res.status(200).json({
        total: totalVideos || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
