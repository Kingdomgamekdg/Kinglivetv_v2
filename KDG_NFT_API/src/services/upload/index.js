'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Uploads')

class UploadsService extends BaseService {
  async mappingAvatar ({ data, key = 'user' }) {
    for (const i of data) {
      if (i[key]?.kyc?.avatar) {
        i[key].kyc.avatar = await this.findById(i[key].kyc.avatar)
      }
    }

    return data
  }
}

module.exports = new UploadsService(Model)
