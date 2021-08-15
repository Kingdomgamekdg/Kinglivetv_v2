'use strict'

const { isValidObjectId } = require('mongoose')
const UserAssetsService = require('../../services/user-asset')
const UsersService = require('../../services/user')
const ObjectId = require('mongoose').Types.ObjectId; 

const { query } = require('express')

const mapOrder = (array, myorder, key) => {
  var order = myorder.reduce((r, k, i) => (r[k] = i + 1, r), {})
  const theSort = array.sort((a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity))
  return theSort
}


module.exports = class {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async getUserAsset (_req, _res) {
    const params = _req.query
    const { _id } = _req

    const limit = params.limit ? parseInt(params.limit) : 10
    const user = await UsersService.findById(_id)

    if (!Object.keys(user).length) {
      return _res.send({ status: 1, data: [] })
    }
    const ids = params.ids ? params.ids.split(',') : []

    const match = {}

    const status = params.status ? parseInt(params.status) : ''
    if (status) {
      match.status = status
    }

    if (params.mimetype) {
      const mimetype = params.mimetype.split(',').map(i => i.trim())
      match['metadata.mimetype'] = {
        $in: mimetype
      }
    }

    if (params.prev && isValidObjectId(params.prev)) {
      query._id = { $lt: params.prev }
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

   static async getUserAssetByIds (_req, _res) {
    const params = _req.query
    const { _id } = _req
    const match = {}
    const limit = params.limit ? parseInt(params.limit) : 10
    const user = await UsersService.findById(_id)

    if (!Object.keys(user).length) {
      return _res.send({ status: 1, data: [] })
    }
    const ids = params.ids ? params.ids.split(',') : []

    const filter = {
      _id: { $in: ids },
    }

    const data = await UserAssetsService.getUserAssets({ filter, match, limit })
    const myOrder = ids.map(id =>{ return new ObjectId(id)})
    const orderData = mapOrder(data,myOrder,'_id');
    return _res.status(200).json({ status: 1, orderData })
  }
}
