/* eslint-disable camelcase */
'use strict'

const joi = require('joi')
const jwt = require('../../libs/jwt')
const { model } = require('mongoose')
const Users = model('users')
const response = require('../../libs/http-response')
const common = require('../../libs/common')

class Controller {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async login (_req, _res) {
    // console.log("_req",_req);
    const params = common.validateInputParams(_req.body, joi.object().keys({
      address: joi.string().trim().required()
    }))
    const user = await Users.findOne({ address: params.address.toLowerCase() })
    if (user) {
      const token = jwt.issueToken({
        id: params.address
      })

      response.success(_res, {
        token,
        user: user || {}
      })
    } else {
      const user = await Users.create({ address: params.address.toLowerCase() })
      const token = jwt.issueToken({
        id: params.address
      })

      response.success(_res, {
        token,
        user: user || {}
      })
    }
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
   * Get total users
   */

  static async getTotalUsers (_req, _res) {
    try {
      const queries = common.validateInputParams(_req.query, joi.object().keys({
        isLock: joi.boolean(),
        isReviewer: joi.boolean(),
        kycStatus: joi.number()
      }))

      const {
        isLock,
        isReviewer,
        kycStatus
      } = queries

      const condition = {}

      if (isLock !== undefined) {
        condition.isLock = isLock
      }

      if (isReviewer !== undefined) {
        condition.isReviewer = isReviewer
      }

      if (kycStatus !== undefined) {
        condition['kyc.status'] = kycStatus
      }

      const totalUsers = await Users.countDocuments(condition)

      _res.status(200).json({
        total: totalUsers || 0
      })
    } catch (e) {
      _res.status(400).send(e.message)
    }
  }
}

module.exports = Controller
