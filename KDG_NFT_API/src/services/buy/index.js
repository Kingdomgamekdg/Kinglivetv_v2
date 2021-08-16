'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Buys')

class BuysService extends BaseService {
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

  async getTopSeller (conditions, type, limit) {
    return this.aggregate([
      {
        $match: conditions
      },
      {
        $group: {
          _id: '$to',
          [type]: { $sum: `$${type}` }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $sort: {
          quantity: -1
        }
      },
      {
        $limit: limit
      }
    ])
  }
}

module.exports = new BuysService(Model)
