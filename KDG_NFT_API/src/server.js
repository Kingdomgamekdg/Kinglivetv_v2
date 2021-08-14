'use strict'

require('dotenv').config()

const fs = require('fs')
const Path = require('path')
const bodyParser = require('body-parser')

const express = require('express')
const app = express()

require('http').createServer(app)

const router = require('express-async-router').AsyncRouter()

const config = require('./configs')
const response = require('./libs/http-response')
const ipfs = require('./libs/ipfs')
const database = require('./libs/database')

const events = require('events')
const eventEmitter = new events.EventEmitter()
const mongoose = require('mongoose')

class Server {
  /**
   * Initializes default settings
   */
  constructor () {
    // Uses the middlewares
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB
    } = config

    // let dbURI = `mongodb://localhost:27017/admin`
    const auth = MONGO_USER && MONGO_PASSWORD ? MONGO_USER + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' : ''
    const dbURI = `mongodb://${auth}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
    // let dbURI =`mongodb://KDG:Kingdomgame%40%40123@10.104.0.23:27017/KDG?authSource=admin`
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    // Defines api routes
    app.use('/api', router)

    const models = fs.readdirSync(Path.join(__dirname, '/models'))

    models.forEach(model => require(Path.join(__dirname, 'models', model)))

    const routes = fs.readdirSync(Path.join(__dirname, '/routes'))

    routes.forEach(route => require(Path.join(__dirname, 'routes', route))(router, eventEmitter))

    require('./nms')

    app.listen(80)
    // Defines the error handler
    app.use(this._handleError)
  }

  /**
   * The default error handler
   */
  _handleError (_err, _req, _res, _next) {
    try {
      const { image, file } = _req.body

      // Deletes uploaded image in the error case
      if (image && fs.existsSync(image.path)) {
        fs.unlinkSync(image.path)
      }

      // Deletes uploaded file in the error case
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    } catch (e) {
      console.log(e.stack)
    }

    // Sends error to the client
    response.error(_res, _err.code, _err.message)
  }

  /**
   * Starts server and services
   */
  async start () {
    // Starts server
    // await http.listen(configs.PORT);

    // Connects to database
    await database.connect()

    // Connects to IPFS
    await ipfs.connect()

    console.log('Listening on port', 80)
  }
}

module.exports = new Server()
