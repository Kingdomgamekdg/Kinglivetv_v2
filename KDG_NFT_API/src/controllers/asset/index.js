'use strict'

const AssetService = require('../../services/asset')
const ObjectId = require('mongoose').Types.ObjectId; 
const mapOrder = (array, myorder, key) => {
  var order = myorder.reduce((r, k, i) => (r[k] = i + 1, r), {})
  const theSort = array.sort((a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity))
  return theSort
}


module.exports = class {
  static async getTotalAssets (_req, _res) {
    try {
      const queries = _req.query

      const condition = {}
      if (queries.mimetype) {
        const mimetype = queries.mimetype.split(',').map(i => i.trim())
        condition['metadata.mimetype'] = {
          $in: mimetype
        }
      }
      const totalAssets = await AssetService.count(condition)

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

      const assets = await AssetService.find({_id : {$in : ids}}).populate({
        path : 'owner',
      })
      let order = ids.map(id =>{
        return new ObjectId(id);
      })
      const ordered_array = mapOrder(assets, order, '_id');
      console.log("ids",order);
      console.log("ordered_array",ordered_array);
      _res.status(200).json({
        status:1,
        data: ordered_array
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
