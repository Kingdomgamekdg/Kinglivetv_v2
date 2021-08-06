'use strict';

require('dotenv').config();
const fs = require('fs');

const app = require('express')();
const http = require('http').createServer(app);

const logger = require('./lib/logger');
const database = require('./lib/database');
const ipfs = require('./lib/ipfs');

const config = require('./config');

const log = logger.getAppLog();
const events = require('events');
const eventEmitter = new events.EventEmitter();
const mongoose = require('mongoose')

class Server {

    constructor(){
        let dbURI = `mongodb://${config.MONGO_USER}:${encodeURIComponent(config.MONGO_PASSWORD)}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`
        // let dbURI = `mongodb://localhost:27017/admin`
        // let dbURI =`mongodb://KDG:Kingdomgame%40%40123@10.104.0.23:27017/KDG?authSource=admin`
        mongoose.connect(dbURI,{
            useNewUrlParser : true ,
            useFindAndModify : false ,
            useCreateIndex : true,
            useUnifiedTopology: true
        });
        const path = require('path')
        const models = fs.readdirSync(__dirname + '/models')
        console.log("models",models);
        models.forEach(model => require(path.join(__dirname,'models' , model)))
    }

    /**
     * Starts server and services
     */
    async start () {
        log.info('Listening on port', config.port);

        // Starts server
        await http.listen(config.port);

        // Connects to database
        await database.connect();

        // Connects to IPFS
        await ipfs.connect();

        // Starts services
        const service = require('./service');

        await service.subscriberAsset.start();
    }

}

module.exports = new Server();
