'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Users')

class UsersService extends BaseService {}

module.exports = new UsersService(Model)
