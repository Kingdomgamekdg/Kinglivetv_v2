'use strict'

const ActivityService = require('../../services/activities')

module.exports = class {
  static async getVolumeDonate (_req, _res) {
    try {
      const params = _req.query

      const {
        type = 3
      } = params

      const data = await ActivityService.getVolumeDonate({ type })

      _res.status(200).json({
        total: data.length ? data[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
