'use strict';

const { Client } = require('pg');

const log = require('./../logger').getAppLog();

class Database {

    /**
     * Initializes default settings
     */
    constructor () {
        this._db = new Client({
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            user: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB_NAME
        });
    }

    /**
     * Connects to database server
     */
    async connect () {
        try {
            await this._db.connect();

            log.info('Connected to postgres');

        } catch (e) {
            log.error('Occured error when connecting to postgres. Error:', e.message);
        }
    }

    /**
     * Query data in database and return the result
     */
    async query (..._sql) {
        try {
            const { rows } = await this._db.query(..._sql);

            return rows;

        } catch (e) {
            log.debug(_sql);
            log.error(e.stack);
            return null;
        }
    }

    /**
     * Gets database instance
     */
    getInstance () {
        return this._db;
    }

}

module.exports = new Database();
