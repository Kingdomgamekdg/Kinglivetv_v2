'use strict'

const joi = require('joi')
const { model } = require('mongoose')
const common = require('../../libs/common')
const Assets = model('assets')

module.exports = class {
  static async getTotalAssets (_req, _res) {
    try {
      const queries = common.validateInputParams(_req.query, joi.object().keys({
        mimetype: joi.string()
      }))

      const condition = {}
      if (queries.mimetype) {
        const mimetype = queries.mimetype.split(',').map(i => i.trim())
        condition['metadata.mimetype'] = {
          $in: mimetype
        }
      }
      const totalAssets = await Assets.countDocuments(condition)

      _res.status(200).json({
        total: totalAssets || 0
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
