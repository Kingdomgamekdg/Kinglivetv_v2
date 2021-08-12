'use strict'
const { IsEmpty } = require('../../utils/common-util')

const ListingAssetsService = require('../../services/listing-assets')
const UsersService = require('../../services/users')

module.exports = class {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async getListingAsset (_req, _res) {
    const params = _req.query
    const { _id } = _req
    const user = await UsersService.findById(_id)

    if (IsEmpty(user)) {
      _res.status(200).json({ status: 1, data: [] })
    }
    // const query = {user : ObjectId(user._id)};
    // if(params.prev && isValidObjectId(params.prev)) {
    //     query._id = {$lt : prev}
    // }
    const ids = params.ids ? params.ids.split(',') : []

    const limit = params.limit ? parseInt(params.limit) : 10

    const data = await ListingAssetsService.getListingAsset({ ids, limit })

    return _res.status(200).json({ status: 1, data })
  }
}
