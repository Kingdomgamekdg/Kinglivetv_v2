'use strict'

const StreamsService = require('../../services/streams')

module.exports = class {
  static async getTotalStreamTime (_req, _res) {
    try {
      const streams = await StreamsService.calculateStreamTime()

      let total = 0
      if (streams.length) {
        total = streams[0].total
      }

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
