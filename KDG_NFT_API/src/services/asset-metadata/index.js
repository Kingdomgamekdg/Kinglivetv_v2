'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/AssetMetadata')

class AssetMetadataService extends BaseService {}

module.exports = new AssetMetadataService(Model)
