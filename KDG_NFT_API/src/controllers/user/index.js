'use strict'

const jwt = require('../../libs/jwt')
const UsersService = require('../../services/user')
const response = require('../../libs/http-response')

module.exports = class {
  /**
   * Uploads metadata and file, image to IPFS
   */
  static async login (_req, _res) {
    // console.log("_req",_req);
    const body = _req.body
    const user = await UsersService.findOne({ address: body.address.toLowerCase() })
    if (user) {
      const token = jwt.issueToken({
        id: body.address
      })

      response.success(_res, {
        token,
        user: user || {}
      })
    } else {
      const user = await UsersService.create({ address: body.address.toLowerCase() })
      const token = jwt.issueToken({
        id: body.address
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
      const queries = _req.query

      const { ...conditions } = queries

      const totalUsers = await UsersService.count(conditions)

      _res.status(200).json({
        total: totalUsers || 0
      })
    } catch (e) {
      _res.status(400).send(e.message)
    }
  }

  static async getPersonalInfo (_req, _res) {
    try {
      const {
        _id
      } = _req

      const data = await UsersService.getPersonality({ userId: _id })

      _res.status(200).json({
        data
      })
    } catch (e) {
      _res.status(400).send(e.message)
    }
  }
}
