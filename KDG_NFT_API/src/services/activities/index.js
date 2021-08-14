'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Activities')

class ActivityService extends BaseService {
  async getVolumeDonate (conditions) {
    return this.aggregate([
      {
        $match: conditions
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
