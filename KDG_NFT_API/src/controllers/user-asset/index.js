'use strict'

const { isValidObjectId } = require('mongoose')
const UserAssetsService = require('../../services/user-asset')
const UsersService = require('../../services/user')

const { query } = require('express')

// const sortObjectArray = ({
//   arr,
//   field,
//   order = 'desc'
// }) => {
//   arr.sort(function (a, b) {
//     const fieldA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field]
//     const fieldB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field]
//
//     let result
//     if (order === 'desc') {
//       result = fieldA > fieldB ? 1 : -1
//     } else {
//       result = fieldA < fieldB ? 1 : -1
//     }
//     return result
//   })
//   return arr
// }

module.exports = class {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async getUserAsset (_req, _res) {
    const { _id } = _req
    const user = await UsersService.findById(_id)

    if (!Object.keys(user).length) {
      return _res.send({
        status: 1,
        data: []
      })
    }
    const queries = _req.query

    const { ...conditions } = queries

    const {
      limit
    } = _req.paging

    const ids = conditions.ids ? conditions.ids.split(',') : []

    const match = {}

    let status = 0
    if (conditions.status) {
      status = parseInt(conditions.status)
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

    const data = await UserAssetsService.getUserAssets({
      filter,
      match,
      limit
    })

    return _res.status(200).json({
      status: 1,
      data
    })
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
    const user = await UsersService.findById(_id)

    if (!Object.keys(user).length) {
      return _res.send({
        status: 1,
        data: []
      })
    }
    const ids = params.ids ? params.ids.split(',') : []

    const filter = {
      _id: { $in: ids }
    }
    // let order = ids.map(id =>{
    //   return new ObjectId(id);
    // })
    const data = await UserAssetsService.getUserAssets({
      filter,
      match
    })
    const order = {}

    ids.forEach(function (a, i) { order[a] = i })
    console.log('order', order)
    console.log('data.length', data.length)

    data.sort(function (a, b) {
      console.log('order[a._id]', order[a._id])
      console.log('order[b._id]', order[b._id])

      return order[a._id.toString()] - order[b._id.toString()]
    })
    // console.log("data",data);

    return _res.status(200).json({
      status: 1,
      data
    })
  }
}
