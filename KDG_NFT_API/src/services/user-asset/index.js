'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/UserAssets')

class UserAssetsService extends BaseService {
  async getUserAssets ({ filter, match, limit }) {
    const data = await this.find(filter)
      .limit(limit)
      .populate({
        path: 'asset',
        match
      })
      .sort({ _id: -1 })
      .lean()
    data.reverse()
    return data.filter(dt => { return dt.asset })
  }
}

module.exports = new UserAssetsService(Model)
