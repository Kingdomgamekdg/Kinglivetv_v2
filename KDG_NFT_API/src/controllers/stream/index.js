'use strict'

const StreamsService = require('../../services/stream')

module.exports = class {
  static async getTotalStreamTime (_req, _res) {
    try {
      const streams = await StreamsService.calculateStreamTime()

      _res.status(200).json({
        total: streams?.length ? streams[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getTotalStreamer (_req, _res) {
    try {
      const streamer = await StreamsService.calculateStreamer()

      _res.status(200).json({
        total: streamer?.length ? streamer[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
