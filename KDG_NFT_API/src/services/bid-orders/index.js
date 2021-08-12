'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/BidOrders')

class BidOrdersService extends BaseService {
  async getTopSeller ({ limit, type }) {
    const field = type === 'revenue' ? 'payment_token' : 'quantity'

    return this.aggregate([
      {
        $match: {
          status: 2
        }
      },
      {
        $group: {
          _id: '$from',
          [field]: { $sum: `$${field}` }
        }
      },
      {
        $lookup: {
          from: 'buys',
          let: {
            from: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and:
                    [
                      { $eq: ['$status', 1] },
                      { $eq: ['$from', '$$from'] }
                    ]
                }
              }
            },
            {
              $group: {
                _id: '$from',
                [field]: { $sum: `$${field}` }
              }
            }
          ],
          as: 'buys'
        }
      },
      { $unwind: { path: '$buys', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          [`buy${field}`]: {
            $ifNull: [`$buys.${field}`, 0]
          }
        }
      },
      {
        $project: {
          item: 1,
          [field]: {
            $add: [`$${field}`, `$buy${field}`]
          }
        }
      },
      {
        $sort: {
          [field]: -1
        }
      },
      {
        $limit: limit
      }
    ]).allowDiskUse(true)
  }
}

module.exports = new BidOrdersService(Model)
