/* eslint-disable camelcase */
'use strict';

const joi = require('joi');
const fs = require('fs');
const path = require('path');
const {model, isValidObjectId} = require('mongoose')
const AssetMetadata = model('asset-metadata');
const ipfs = require('../../libs/ipfs');
const response = require('../../libs/http-response');
const common = require('../../libs/common');
const config = require('../../configs');
const imageConverter = require('../../libs/image');
// const AssetMetadata = require('../../models/AssetMetadata');

const HttpError = require('../../libs/http-error');

class Controller {

    /**
     * Uploads metadata and file, image to IPFS
     */
    static async uploadMetadata (_req, _res) {
        // console.log("_req",_req);
        // const params = common.validateInputParams(_req.body, joi.object().keys({
        //     // type: joi.string().valid(['collection', 'asset']).insensitive().default('collection'),
        //     name: joi.string().trim().required(),
        //     description: joi.string().optional().default(''),
        //     file: joi.object().optional(),
        //     image: joi.object().optional(),
        //     numEditions: joi.number().optional().greater(0).default(1),
        //     // blankMode: joi.object().optional()
        // }));
        const {  name, description, image,file , numEditions } = _req.body;
        console.log("_req.body",_req.body);
        const content = {
            name,
            description,
        };

        let preview;
        let thumbnail;

        if (file) {
            const hashes = await Controller._uploadFile(file, image);
            console.log("hashes",hashes);
            if (file.mimetype.startsWith('image')) {
                content.image = `${config.IPFS_GATEWAY}/${hashes[0]}`;

                preview = `${config.IPFS_GATEWAY}/${hashes[1]}`;
                thumbnail = `${config.IPFS_GATEWAY}/${hashes[2]}`;

            } else {
                content.animation_url = `${config.IPFS_GATEWAY}/${hashes[0]}`;
                content.image = `${config.IPFS_GATEWAY}/${hashes[1]}`;

                preview = `${config.IPFS_GATEWAY}/${hashes[2]}`;
                thumbnail = `${config.IPFS_GATEWAY}/${hashes[3]}`;
            }

            content.mimetype = file.mimetype;
        }

        const data = [];
        const metadataList = [];

        // Creates metadata to upload ipfs
        // for (let i = 1; i <= numEditions; i++) {
        const metadata = { ...content };            

        data.push({
            path: '/',
            content: Buffer.from(JSON.stringify(metadata))
        });

        metadata.image_preview = preview;
        metadata.image_thumbnail = thumbnail;
        console.log("metadata",metadata);
        metadataList.push({ metadata });
        // }

        // Uploads metadata to IPFS
        const hashes = await ipfs.addFiles(data);

        if (hashes == null) {
            throw new HttpError(500);
        }

        // Creates metadata to save database
        for (let i = 0; i < hashes.length; i++) {
            metadataList[i].uri = hashes[i];
        }
        console.log("metadataList",metadataList);
        // await Controller._saveCollectionMetadata(metadataList);
        if(metadataList.length)
        await AssetMetadata.create({uri: metadataList[0]?.uri , metadata : metadataList[0]?.metadata })
        response.success(_res, { hashes });
    }

    /**
     * Uploads file and image to IPFS
     */
     static async _uploadFile (_file, _image) {
        let name = _file.filename + path.extname(_file.originalname).toLowerCase();

        const binary = fs.readFileSync(_file.path);

        const data = [];

        data.push({
            path: `/${name}`,
            content: binary
        });

        let files = [];

        if (_file.mimetype.startsWith('image')) {
            files = await imageConverter.resize(binary, [500, 100], _file.mimetype);
        } else {
            if (!_image) {
                throw new HttpError(400, '"image" is required');
            }

            name = _image.filename + path.extname(_image.originalname).toLowerCase();

            files.push(fs.readFileSync(_image.path));

            files = files.concat(await imageConverter.resize(files[0], [500, 100], _image.mimetype));

            fs.unlinkSync(_image.path);
        }

        files.forEach(binary => {
            data.push({
                path: `/${name}`,
                content: binary
            });
        });

        // Uploads files to IPFS
        const hashes = await ipfs.addFiles(data, { wrapWithDirectory: true });

        if (hashes == null) {
            throw new HttpError(500);
        }

        fs.unlinkSync(_file.path);

        return hashes;
    }

    /**
     * Saves asset metadata into database
     */
    static async _saveAssetMetadata (_metadata) {
        if (_metadata.length === 0) {
            return;
        }

        await common.queryData('SELECT * FROM BLANK_VIEWER.FNC_ASSET_METADATA_CREATE($1)', [
            JSON.stringify(_metadata)
        ]);
    }

    /**
     * Saves collection metadata into database
     */
    static async _saveCollectionMetadata (_metadata) {
        if (_metadata.length === 0) {
            return;
        }

        await common.queryData('SELECT * FROM BLANK_VIEWER.FNC_COLLECTION_METADATA_CREATE($1)', [
            JSON.stringify(_metadata)
        ]);
    }

}

module.exports = Controller;
