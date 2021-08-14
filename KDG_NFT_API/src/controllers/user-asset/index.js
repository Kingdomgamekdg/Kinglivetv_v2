'use strict'

const { isValidObjectId } = require('mongoose')
const UserAssetsService = require('../../services/user-asset')
const UsersService = require('../../services/user')

const { query } = require('express')

module.exports = class {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async getUserAsset (_req, _res) {
    const { _id } = _req

    const user = await UsersService.findById(_id)

    if (!Object.keys(user).length) {
      return _res.send({ status: 1, data: [] })
    }
    const queries = _req.query

    const { ...conditions } = queries

    const {
      limit
    } = _req.paging

    const ids = conditions.ids ? conditions.ids.split(',') : []

    const match = {}

    const status = conditions.status ? parseInt(conditions.status) : ''
    if (status) {
      match.status = status
    }

    if (conditions.mimetype) {
      const mimetype = conditions.mimetype.split(',').map(i => i.trim())
      match['metadata.mimetype'] = {
        $in: mimetype
      }
    }

    if (conditions.prev && isValidObjectId(conditions.prev)) {
      query._id = { $lt: conditions.prev }
    }

    const filter = {
      _id: { $nin: ids },
      user: user._id,
      amount: { $gt: 0 }
    }

    if (status === 0 && user?.isReviewer) {
      delete filter.user
    }

    const data = await UserAssetsService.getUserAssets({ filter, match, limit })

    return _res.status(200).json({ status: 1, data })
  }

  /**
   * Uploads file and image to IPFS
   */
  // static async updateUser (_req, _res) {
  //   const params = common.validateInputParams(_req.body, joi.object().keys({
  //     name: joi.string().trim().required()
  //   }))
  //   const queries = common.validateInputParams(_req.query, joi.object().keys({
  //     address: joi.string().trim().required()
  //   }))
  // }

  /**
   * Saves asset metadata into database
   */
}
