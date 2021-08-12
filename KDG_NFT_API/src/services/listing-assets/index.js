'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/ListingAsset')

class ListingAssetsService extends BaseService {

  async getListingAsset ({ ids, limit }) {
    const data = await this
      .find({
        _id: { $nin: ids },
        quantity: { $gt: 0 }
      })
      .limit(limit)
      .populate({
        path: 'asset owner'
      })
      .populate({
        path: 'buys',
        populate: 'from to'
      })
      .populate({
        path: 'bid_orders',
        populate: 'from to'
      })
      .sort({ _id: -1 })
      .lean()
    data.reverse()
    return data
  }
}

module.exports = new ListingAssetsService(Model)
