'use strict'

const ActivityService = require('../../services/activities')
const UsersService = require('../../services/user')

module.exports = class {
  static async getVolumeDonate (_req, _res) {
    try {
      const queries = _req.query

      const { ...conditions } = queries

      if (!conditions.type) {
        conditions.type = 3
      }

      const data = await ActivityService.getVolumeDonate(conditions)

      _res.status(200).json({
        total: data.length ? data[0].total : 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getHistoryDonates (_req, _res) {
    try {
      const {
        _id
      } = _req

      const user = await UsersService.findById(_id)

      if (!Object.keys(user).length) {
        return _res.send({
          status: 1,
          data: []
        })
      }

      const queries = _req.query

      const { ...conditions } = queries

      if (!conditions.type) {
        conditions.type = 3
      }

      conditions.from_user = _id

      const data = await ActivityService.find(conditions)
        .populate({
          path: 'asset'
        })

      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
