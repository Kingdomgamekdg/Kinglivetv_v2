'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Stream')
const ObjectId = require('mongoose').Types.ObjectId

class StreamsService extends BaseService {
  async calculateStreamTime ({ userId }) {
    const match = {
      status: 2,
      end_date: {
        $exists: true
      }
    }
    if (userId) {
      match.user = ObjectId(userId)
    }

    return this.aggregate([
      {
        $match: match
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

  async calculateStreamer () {
    return this.aggregate([
        {
          $group: {
            _id: '$user'
          }
        },
        {
          $count: 'total'
        }
      ]
    )
  }
}

module.exports = new StreamsService(Model)
