'use strict'

require('dotenv').config()
const fs = require('fs')

const app = require('express')()
const http = require('http').createServer(app)

const logger = require('./lib/logger')
const database = require('./lib/database')
const ipfs = require('./lib/ipfs')

const config = require('./config')

const log = logger.getAppLog()
const events = require('events')
const eventEmitter = new events.EventEmitter()
const mongoose = require('mongoose')

class Server {
  constructor () {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB,
      REDIS_HOST,
      REDIS_PORT,
      REDIS_PASSWORD,
      REDIS_DB
    } = config

    // let dbURI = `mongodb://localhost:27017/admin`
    const auth = MONGO_USER && MONGO_PASSWORD ? MONGO_USER + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' : ''
    const dbURI = `mongodb://${auth}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
    // let dbURI = `mongodb://localhost:27017/admin`
    // let dbURI =`mongodb://KDG:Kingdomgame%40%40123@10.104.0.23:27017/KDG?authSource=admin`
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    const path = require('path')
    const models = fs.readdirSync(__dirname + '/models')
    console.log('models', models)
    models.forEach(model => require(path.join(__dirname, 'models', model)))

    const nQueue = require('./cores/queue')
    const RedisConfig = {
      'host': REDIS_HOST,
      'port': REDIS_PORT,
      'db': REDIS_DB
    }

    if (REDIS_PASSWORD) {
      RedisConfig.password = REDIS_PASSWORD
    }
    global.Queue = new nQueue(RedisConfig)
  }

  /**
   * Starts server and services
   */
  async start () {
    log.info('Listening on port', config.port)

    // Starts server
    await http.listen(config.port)

    // Connects to database
    await database.connect()

    // Connects to IPFS
    await ipfs.connect()

    // Starts services
    const service = require('./service')

    await service.subscriberAsset.start()
  }

}

module.exports = new Server()
