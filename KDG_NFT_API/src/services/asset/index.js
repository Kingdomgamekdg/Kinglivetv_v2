'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Assets')

class AssetService extends BaseService {}

module.exports = new AssetService(Model)
