'use strict'

const { model } = require('mongoose')
const ListingAssets = model('listing-assets')
const Users = model('users')

class Controller {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async getListingAsset (_req, _res) {
    const params = _req.query
    const { _id } = _req
    const user = await Users.findById(_id)
    // const query = {user : ObjectId(user._id)};
    // if(params.prev && isValidObjectId(params.prev)) {
    //     query._id = {$lt : prev}
    // }
    const ids = params.ids ? params.ids.split(',') : []

    const limit = params.limit ? parseInt(params.limit) : 10

    const data = await ListingAssets
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

    return _res.status(200).json({ status: 1, data })
  }
}

module.exports = Controller
