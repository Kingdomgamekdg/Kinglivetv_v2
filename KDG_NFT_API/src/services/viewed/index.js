'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Viewed')

class ViewedService extends BaseService {}

module.exports = new ViewedService(Model)
