/* eslint-disable camelcase */
'use strict';

const joi = require('joi');
const {model, isValidObjectId} = require('mongoose')
const ListingAssets = model('listing-assets');
const Users = model('users');

const response = require('../../lib/http-response');
const common = require('../../lib/common');

// const AssetMetadata = require('../../models/AssetMetadata');

const HttpError = require('../../lib/http-error');
const ObjectId = require('mongoose').Types.ObjectId; 
const { query } = require('express');

class Controller {

    /**
     * Uploads metadata and file, image to IPFS
     */
    static async getListingAsset (_req, _res) {
        const params = common.validateInputParams(_req.query, joi.object().keys({
            limit: joi.number().required(),
            search: joi.string().trim(),
            prev: joi.string().trim(),
            ids: joi.string().trim(),
        }));
        const {_id} = _req;
        const user = await Users.findById(_id);
        console.log("user",user);
        // const query = {user : ObjectId(user._id)};
        // if(params.prev && isValidObjectId(params.prev)) {
        //     query._id = {$lt : prev}
        // }
        const ids = params.ids ? params.ids.split(',') : []

        const data = await ListingAssets.find()
        .find(({ 
            $and : [
                {_id: { $nin: ids }} ,
                {quantity: {$gt : 0}},
            ],
        }))
        .limit(params.limit)
        .populate({
            path : 'asset owner bid_orders',
        })
        .sort({_id : -1})
        .lean()
        data.reverse()

        return _res.status(200).json({status : 1 , data})
    }

}

module.exports = Controller;
