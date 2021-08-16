'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/ListingAsset')

class ListingAssetsService extends BaseService {
  async getListingAsset ({ ids }, limit) {
    const data = await this
      .find({
        _id: { $nin: ids },
        quantity: { $gt: 0 }
      })
      .sort({ quantity: 1 })
      .limit(limit)
      .populate({
        path: 'asset owner',
        populate: {
          path: 'kyc.avatar uploads'
        }
      })
      .populate({
        path: 'buys',
        populate: {
          path: 'from to',
          populate: {
            path: 'kyc.avatar uploads'
          }
        }
      })
      .populate({
        path: 'bid_orders',
        populate: {
          path: 'from to',
          populate: {
            path: 'kyc.avatar uploads'
          }
        }
      })
      .lean()
    data.reverse()

    return data
  }

  async getTopSellAssets (conditions, limit) {
    const data = await this
      .find(conditions)
      .sort({ quantity: 1 })
      .limit(limit)
      .populate({
        path: 'asset owner',
        populate: {
          path: 'kyc.avatar uploads'
        }
      })
      .populate({
        path: 'buys',
        populate: {
          path: 'from to',
          populate: {
            path: 'kyc.avatar uploads'
          }
        }
      })
      .populate({
        path: 'bid_orders',
        populate: {
          path: 'from to',
          populate: {
            path: 'kyc.avatar uploads'
          }
        }
      })
      .lean()
    data.reverse()
    //
    // if (data.length) {
    //   data = await UploadsService.mappingAvatar({ data, key: 'owner' })
    // }
    return data
  }
}

module.exports = new ListingAssetsService(Model)
