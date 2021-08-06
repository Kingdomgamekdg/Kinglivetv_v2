/* eslint-disable camelcase */
'use strict';

const util = require('util');
const request = require('request');

const database = require('../../lib/database');

const requestPromise = util.promisify(request);
const {model, isValidObjectId} = require('mongoose');
const Assets = model('assets') ;
const AssetMetaData = model('asset-metadata') ;
const UserAsset = model('user_assets') ;
const Users = model('users') ;

class MetadataFetcher {

    /**
     * Initializes default settings
     */
    constructor () {
        this._handling = false;
    }

   
    async start () {
        console.log('Started metadata service');

        const db = database.getInstance();
        // console.log("db",db);
        db.on('notification', async (data) => {
            // console.log("data",data);
            const payload = JSON.parse(data.payload);
            const metadata  = await AssetMetaData.findOne({uri:payload.uri});
            // console.log("payload.uri",payload.uri);
            // console.log("metadata",metadata);

            if (data.channel === 'new_asset') {
                const asset = await Assets.create({ collection_id : payload.collection_id,
                    id : payload.id,
                    metadata : metadata.metadata,
                    owner  :  payload.creator,
                    editions : payload.editions,
                    total_editions : payload.total_editions
                });
                const user = await Users.findOne({address : payload.creator});
                await UserAsset.create({asset: asset?._id , user: user?._id, amount : payload.editions});
            }
        });

        db.query('LISTEN new_asset');

        
    }

}

module.exports = new MetadataFetcher();
