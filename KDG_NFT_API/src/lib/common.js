/* eslint-disable camelcase */
'use strict';

const joi = require('joi');
const fetch = require('node-fetch');

const config = require('./config');
const constant = require('./config/constant');
const HttpError = require('./http-error');

class Common {

    /**
     * Validates all parameters that is sent by GET or POST, then return the values
     */
    validateInputParams (_params, _schema) {
        const { error, value } = joi.validate(_params, _schema);

        if (error) {
            throw new HttpError(400, error.details[0].message);
        }

        return value;
    }

    /**
     * Wraps the controller handler that contains async/await
     */
    wrapAsync (_fn) {
        return (req, res, next) => {
            Promise.resolve(_fn(req, res, next)).catch(next);
        };
    }

    /**
     * Finds collection by address
     */
    findCollection (_addr) {
        const collections = constant.contracts.collections;

        for (const alias in collections) {
            const collection = collections[alias];

            if (collection.address.toLowerCase() === _addr) {
                return { alias, ...collection };
            }
        }

        return null;
    }

    /**
     * Saves metadata into database
     * We don't want to call ipfs or the 3rd party api to get metadata in next time
     */
    async saveMetadata (_metadata) {
        if (_metadata.length === 0) {
            return;
        }

        await this.queryData('SELECT * FROM BLANK_VIEWER.FNC_ASSET_METADATA_UPDATE($1)', [
            JSON.stringify(_metadata)
        ]);
    }

    /**
     * Saves metadata into database
     * We don't want to call ipfs or the 3rd party api to get metadata in next time
     */
    async saveMetadata2 (_erc721Metadata, _erc1155Metadata) {
        const promises = [];

        if (_erc721Metadata.length > 0) {
            promises.push(this.queryData('SELECT * FROM BLANK_VIEWER.FNC_ASSET_ERC721_METADATA_UPDATE($1)', [
                JSON.stringify(_erc721Metadata)
            ]));
        }

        if (_erc1155Metadata.length > 0) {
            promises.push(this.queryData('SELECT * FROM BLANK_VIEWER.FNC_ASSET_ERC1155_METADATA_UPDATE($1)', [
                JSON.stringify(_erc1155Metadata)
            ]));
        }

        await Promise.all(promises);
    }

    /**
     * Fetchs asset metadata from OpenSea
     */
    async fetchMetadata (_collectionId, _assetId) {
        const { address } = constant.opensea.collections[_collectionId];

        const res = await fetch(`https://api.opensea.io/api/v1/asset/${address}/${_assetId}`, {
            headers: {
                'x-api-key': constant.opensea.api_key,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('OpenSea did not return proper metadata: ' + res.statusText);
        }

        const { name, description, image_url, image_thumbnail_url, image_original_url, animation_original_url, external_link, background_color, traits } = await res.json();

        return {
            name,
            description,
            image: image_original_url,
            image_preview: image_url,
            image_thumbnail: image_thumbnail_url,
            animation_url: animation_original_url,
            external_link,
            background: !background_color ? undefined : '#' + background_color,
            attributes: traits
        };
    }

    /**
     * Fetchs asset metadata from OpenSea
     */
    async fetchMetadata2 (_collectionId, _assetId) {
        const res = await fetch(`${config.OPENSEA_API}/asset/${_collectionId}/${_assetId}`, {
            headers: {
                'x-api-key': constant.opensea.api_key,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('OpenSea did not return proper metadata: ' + res.statusText);
        }

        const { name, description, image_url, image_original_url, animation_url, animation_original_url, image_preview_url, image_thumbnail_url, external_link, background_color, traits, asset_contract } = await res.json();

        return {
            name,
            description,
            image: image_original_url || image_url,
            image_preview: image_preview_url,
            image_thumbnail: image_thumbnail_url,
            animation_url: animation_original_url || animation_url,
            external_url: external_link,
            background_color,
            attributes: traits,
            contract_name: asset_contract.name
        };
    }

}

module.exports = new Common();
