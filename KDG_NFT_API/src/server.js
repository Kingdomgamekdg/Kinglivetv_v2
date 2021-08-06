'use strict';

require('dotenv').config();

const fs = require('fs');
const cors = require('cors');
const bodyParser= require('body-parser')

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const router = express.Router()


const config = require('./lib/config');
const response = require('./lib/http-response');
const ipfs = require('./lib/ipfs');
const database = require('./lib/database');

const events = require('events');
const eventEmitter = new events.EventEmitter();
const mongoose = require('mongoose')

class Server {

    /**
     * Initializes default settings
     */
    constructor () {
        // Uses the middlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(bodyParser.json())

        // let dbURI = `mongodb://localhost:27017/admin`
        //let dbURI = `mongodb://${config.MONGO_USER}:${encodeURIComponent(config.MONGO_PASSWORD)}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`
        let dbURI =`mongodb://KDG:Kingdomgame%40%40123@10.104.0.23:27017/KDG?authSource=admin`
        mongoose.connect(dbURI,{
            useNewUrlParser : true ,
            useFindAndModify : false ,
            useCreateIndex : true,
            useUnifiedTopology: true
        })
        // Defines api routes
        app.use('/api' , router)

        const fs = require('fs')
        console.log(fs.readdirSync(__dirname + '/ffmpeg'));
        const path = require('path')
        const models = fs.readdirSync(__dirname + '/models')
        console.log("models",models);
        models.forEach(model => require(path.join(__dirname,'models' , model)))
        
        const routes = fs.readdirSync(__dirname + '/routes')
        routes.forEach(route=> require(path.join(__dirname, 'routes' , route))(router,eventEmitter))
        require('./nms')
        
        
        
        app.listen(80)
        // Defines the error handler
        app.use(this._handleError);
    }

    /**
     * The default error handler
     */
    _handleError (_err, _req, _res, _next) {
        try {
            const { image, file } = _req.body;

            // Deletes uploaded image in the error case
            if (image && fs.existsSync(image.path)) {
                fs.unlinkSync(image.path);
            }

            // Deletes uploaded file in the error case
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

        } catch (e) {
            console.log(e.stack);
        }

        // Sends error to the client
        response.error(_res, _err.code, _err.message);
    }

    /**
     * Starts server and services
     */
    async start () {
        console.log('Listening on port', 80);

        // Starts server
        // await http.listen(config.PORT);

        // Connects to database
        await database.connect();

        // Connects to IPFS
        await ipfs.connect();

    }

}

module.exports = new Server();