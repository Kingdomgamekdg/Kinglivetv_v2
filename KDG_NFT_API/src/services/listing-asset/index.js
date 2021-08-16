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
      .lean()
    data.reverse()

    return data
  }

  async getListingAssetsByIds ({ ids }) {
    const data = await this
      .find({
        _id: { $in: ids }
      })
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

    const order = ids.reduce((obj, o, i) => {
      obj[o] = i
      return obj
    }, {})

    data.sort(function (a, b) {
      console.log('order[a._id]', order[a._id])
      console.log('order[b._id]', order[b._id])
      return order[a._id.toString()] - order[b._id.toString()]
    })

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
