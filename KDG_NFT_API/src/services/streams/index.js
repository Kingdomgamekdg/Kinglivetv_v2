'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Stream')

class StreamsService extends BaseService {
  async calculateStreamTime () {
    return this.aggregate([
      {
        $match: {
          status: 2,
          end_date: {
            $exists: true
          }
        }
      },
      {
        $project: {
          _id: 1,
          start_date: 1,
          end_date: 1,
          streamTime: { $subtract: ['$end_date', '$start_date'] }
        }
      },
      {
        $group:
          {
            _id: null,
            total: { $sum: '$streamTime' }
          }
      }
    ])
  }
}

module.exports = new StreamsService(Model)
