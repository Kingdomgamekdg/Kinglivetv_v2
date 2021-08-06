/* eslint-disable camelcase */
'use strict';

const joi = require('joi');
const jwt = require('../../lib/jwt');
const {model, isValidObjectId} = require('mongoose')
const Users = model('users');
const response = require('../../lib/http-response');
const common = require('../../lib/common');

// const AssetMetadata = require('../../models/AssetMetadata');

const HttpError = require('./../../lib/http-error');

class Controller {

    /**
     * Uploads metadata and file, image to IPFS
     */
    static async login (_req, _res) {
        // console.log("_req",_req);
        const params = common.validateInputParams(_req.body, joi.object().keys({
            address: joi.string().trim().required(),
        }));
        let user = await Users.findOne({address:params.address.toLowerCase()});
        if(user){
            const token = jwt.issueToken({
                id: params.address
            });
    
            response.success(_res, {
                token,
                user: user || {}
            });
        } else {
            let user = await Users.create({address:params.address.toLowerCase()});
            const token = jwt.issueToken({
                id: params.address
            });
    
            response.success(_res, {
                token,
                user: user || {}
            });
        }
    }

    /**
     * Uploads file and image to IPFS
     */
     static async updateUser (_req, _res) {
        const params = common.validateInputParams(_req.body, joi.object().keys({
            name: joi.string().trim().required(),
        }));
        const queries = common.validateInputParams(_req.query, joi.object().keys({
            address: joi.string().trim().required(),
        }));
    }

    /**
     * Saves asset metadata into database
     */
   

}

module.exports = Controller;
