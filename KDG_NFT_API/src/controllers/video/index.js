'use strict'
const VideoService = require('../../services/video')

module.exports = class {
  static async getTotalVideos (_req, _res) {
    try {
      const queries = _req.query

      const { ...conditions } = queries

      const totalVideos = await VideoService.count(conditions)

      _res.status(200).json({
        total: totalVideos || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
