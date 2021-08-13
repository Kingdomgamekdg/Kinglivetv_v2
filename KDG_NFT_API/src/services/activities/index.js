'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Activities')

class ActivityService extends BaseService {
  async getVolumeDonate ({ type }) {
    return this.aggregate([
      {
        $match: {
          type
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: '$data.amount' }
          }
        }
      }
    ])
  }
}

module.exports = new ActivityService(Model)
