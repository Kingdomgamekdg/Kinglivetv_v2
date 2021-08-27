'use strict'

const ListingAssetService = require('../../services/listing-asset')
const UsersService = require('../../services/user')
const { IsEmpty } = require('../../utils/common-util')

module.exports = class {
  static async getList (_req, _res) {
    try {
      const {
        _id
      } = _req

      const user = await UsersService.findById(_id)

      if (IsEmpty(user)) {
        return _res.send({
          status: 1,
          data: []
        })
      }

      const queries = _req.query
      const { ...conditions } = queries
      const ids = conditions.ids ? conditions.ids.split(',') : []

      const match = {}
      if (conditions.mimetype) {
        match['metadata.mimetype'] = {
          $regex: conditions.mimetype.toLowerCase()
        }
        delete conditions.mimetype
      }

      const data = await ListingAssetService.find({
        owner: _id,
        quantity: {
          $gt: 0
        },
        _id: { $nin: ids }
      })
        .populate({
          path: 'asset',
          match
        })

      _res.status(200).json({
        data: data.filter(i => i.asset)
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
