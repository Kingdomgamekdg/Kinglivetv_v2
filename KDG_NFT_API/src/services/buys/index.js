'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Buys')

class BuysService extends BaseService {}

module.exports = new BuysService(Model)
