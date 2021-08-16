'use strict'

const AssetService = require('../../services/asset')
const ObjectId = require('mongoose').Types.ObjectId
const mapOrder = (array, mOrder, key) => {
  const order = mOrder.reduce((r, k, i) => {
    r[k] = i + 1
    return r
  }, {})
  return array.sort((a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity))
}

module.exports = class {
  static async getTotalAssets (_req, _res) {
    try {
      const queries = _req.query
      const { ...conditions } = queries
      if (queries.mimetype) {
        const mimetype = queries.mimetype.split(',').map(i => i.trim())
        conditions['metadata.mimetype'] = {
          $in: mimetype
        }
        delete conditions.mimetype
      }

      const totalAssets = await AssetService.count(conditions)

      _res.status(200).json({
        total: totalAssets || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }

  static async getAsset (_req, _res) {
    try {
      const queries = _req.query
      const ids = queries.ids ? queries.ids.split(',') : []

      const assets = await AssetService.find({ _id: { $in: ids } }).populate({
        path: 'owner'
      })
      const order = ids.map(id => {
        return new ObjectId(id)
      })
      const orderMapping = mapOrder(assets, order, '_id')
      console.log('ids', order)
      console.log('ordered_array', orderMapping)
      _res.status(200).json({
        status: 1,
        data: orderMapping
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
