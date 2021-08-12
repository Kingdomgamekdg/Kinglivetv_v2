'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/BidOrders')

class BidOrdersService extends BaseService {}

module.exports = new BidOrdersService(Model)
