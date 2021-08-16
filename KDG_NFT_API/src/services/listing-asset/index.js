'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/ListingAsset')
const UploadsService = require('../../services/upload')

class ListingAssetsService extends BaseService {
  async getListingAsset ({ ids }, limit) {
    let data = await this
      .find({
        _id: { $nin: ids },
        quantity: { $gt: 0 }
      })
      .sort({ quantity: 1 })
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
      .lean()
    data.reverse()

    if (data.length) {
      data = await UploadsService.mappingAvatar({ data, key: 'owner' })
    }
    return data
  }

  async getTopSellAssets (conditions, limit) {
    let data = await this
      .find(conditions)
      .sort({ quantity: 1 })
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
      .lean()
    data.reverse()

    if (data.length) {
      data = await UploadsService.mappingAvatar({ data, key: 'owner' })
    }
    return data
  }
}

module.exports = new ListingAssetsService(Model)
