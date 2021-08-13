'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Buys')

class BuysService extends BaseService {
  async getTopSeller ({ limit }) {
    return this.aggregate([
      {
        $match: {
          status: 1
        }
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
}

module.exports = new BuysService(Model)
