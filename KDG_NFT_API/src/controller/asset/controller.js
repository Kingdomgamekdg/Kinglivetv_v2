/* eslint-disable camelcase */
'use strict';

const joi = require('joi');
const {model, isValidObjectId} = require('mongoose')
const UserAssets = model('user-assets');
const Users = model('users');

const response = require('../../lib/http-response');
const common = require('../../lib/common');

// const AssetMetadata = require('../../models/AssetMetadata');

const HttpError = require('./../../lib/http-error');
const ObjectId = require('mongoose').Types.ObjectId; 
const { query } = require('express');

class Controller {

    /**
     * Uploads metadata and file, image to IPFS
     */
    static async getUserAsset (_req, _res) {
        const params = common.validateInputParams(_req.query, joi.object().keys({
            limit: joi.number().required(),
            ids: joi.string().trim(),
            status: joi.number(),
            search: joi.string().trim(),
            prev: joi.string().trim(),
        }));
        const {_id} = _req;
        console.log("_id",_id);
        console.log("status",params.status);
        console.log("ids",params.ids);

        const user = await Users.findOne({_id: ObjectId(_id)});
        if(!user){
            return _res.send({status : 1 , data :[]})
        }
        const ids = params.ids ? params.ids.split(',') : []

        // const search = params.search;
        if(params.prev && isValidObjectId(params.prev)) {
            query._id = {$lt : prev}
        }
        let data =[];
        if(params.status && params.status !==0 ){
            data = await UserAssets.find({ 
                $and : [
                    {_id: { $nin: ids }} ,
                    {user : user._id}, 
                    {amount: {$gt : 0}},
                ],
            })
            .limit(params.limit)
            .populate({
                path : 'asset' ,
                match : {status: params.status}
    
            })
            .sort({_id : -1})
            .lean()
            data.reverse()
        } else if(params.status == 0){
            if(user?.isReviewer){
                data = await UserAssets.find({ 
                    $and : [
                        {_id: { $nin: ids }} ,
                        {amount: {$gt : 0}},
                    ],
                })
                .limit(params.limit)
                .populate({
                    path : 'asset' ,
                    match : {status: params.status}
                })
                .sort({_id : -1})
                .lean()
                data.reverse()
            } else {
                data = await UserAssets.find({ 
                    $and : [
                        {_id: { $nin: ids }} ,
                        {amount: {$gt : 0}},
                        {user: user._id},
                    ],
                })
                .limit(params.limit)
                .populate({
                    path : 'asset' ,
                    match : {status: params.status}
        
                })
                .sort({_id : -1})
                .lean()
                data.reverse()
            }
        }
        
        // console.log("data",data);
        return _res.status(200).json({status : 1 , data : data.filter(dt => {return dt.asset})})
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
