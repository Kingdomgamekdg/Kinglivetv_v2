'use strict';

const ipfs = require('ipfs-api');

const log = require('./../logger').getAppLog();

class IPFS {

    /**
     * Initializes default settings
     */
    constructor () {
        this._ipfs = ipfs({
            host: process.env.IPFS_HOST,
            port: process.env.IPFS_PORT,
            protocol: 'http'
        });
    }

    /**
     * Connects to IPFS
     */
    async connect () {
        try {
            // Gets the identity of the IPFS peer to check the connection
            await this._ipfs.id();

            log.info('Connected to ipfs');

        } catch (e) {
            log.error('Occured error when connecting to IPFS. Error:', e.message);
        }
    }

    /**
     * Adds the files to IPFS, then return the hashes of those files
     */
    async addFiles (_files, _options) {
        try {
            const promises = [];

            // Adds the files to IPFS
            _files.forEach((file) => {
                promises.push(this._ipfs.files.add(file, _options));
            });

            const result = await Promise.all(promises);

            const cid = [];

            // Gets CIDs
            if (_options && _options.wrapWithDirectory) {
                result.forEach((item) => {
                    cid.push(item[1].hash + '/' + item[0].path);
                });

            } else {
                result.forEach((item) => {
                    cid.push(item[0].hash);
                });
            }

            return cid;

        } catch (e) {
            log.error(e.stack);
            return null;
        }
    }

}

module.exports = new IPFS();
