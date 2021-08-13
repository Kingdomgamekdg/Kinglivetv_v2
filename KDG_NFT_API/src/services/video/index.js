'use strict'
const BaseService = require('../../cores/base-service')
const Model = require('../../models/Videos')

class VideosService extends BaseService {}

module.exports = new VideosService(Model)
