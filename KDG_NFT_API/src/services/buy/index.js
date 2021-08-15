'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Buys')

class BuysService extends BaseService {
  async getTopSeller (conditions, limit) {
    return this.aggregate([
      {
        $match: conditions
      },
      {
        $group: {
          _id: '$from',
          payment_amount: { $sum: '$payment_amount' }
        }
      },
      {
        $sort: {
          payment_amount: -1
        }
      },
      {
        $limit: limit
      }
    ])
  }

  async getTotalAssetVolume (conditions) {
    return this.aggregate([
      {
        $match: conditions
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment_amount' }
        }
      }
    ])
  }
}

module.exports = new BuysService(Model)
