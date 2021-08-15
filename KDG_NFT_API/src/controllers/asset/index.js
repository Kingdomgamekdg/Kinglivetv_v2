'use strict'

const AssetService = require('../../services/asset')

function mapOrder (array, order, key) {
  
  array.sort( function (a, b) {
    var A = a[key], B = b[key];
    
    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
    
  });
  
  return array;
};

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

      ordered_array = mapOrder(assets, item_order, '_id');


      _res.status(200).json({
        status:1,
        data: ordered_array
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
