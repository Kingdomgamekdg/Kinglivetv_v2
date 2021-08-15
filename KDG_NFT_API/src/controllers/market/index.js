'use strict'
const { IsEmpty } = require('../../utils/common-util')

const ListingAssetsService = require('../../services/listing-asset')
const UsersService = require('../../services/user')

module.exports = class {
  static async getTopSellAssets (_req, _res) {
    const { _id } = _req

    const queries = _req.query

    const { ...conditions } = queries

    const {
      limit
    } = _req.paging

    const user = await UsersService.findById(_id)

    if (IsEmpty(user)) {
      _res.status(200).json({ status: 1, data: [] })
    }

    if (!conditions.quantity) {
      conditions.quantity = { $gt: 0 }
    }
    const data = await ListingAssetsService.getTopSellAssets(conditions, limit)

    return _res.status(200).json({ status: 1, data })
  }

  static async getTopPopulateAssets (_req, _res) {
    const { _id } = _req

    const user = await UsersService.findById(_id)

    if (IsEmpty(user)) {
      _res.status(200).json({ status: 1, data: [] })
    }

    const queries = _req.query

    const { ...conditions } = queries

    const {
      limit
    } = _req.paging

    const ids = conditions.ids ? conditions.ids.split(',') : []

    const data = await ListingAssetsService.getListingAsset({ ids }, limit)

    return _res.status(200).json({ status: 1, data })
  }
}
