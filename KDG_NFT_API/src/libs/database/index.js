'use strict';

const { Pool } = require('pg');

// const log = require('./../logger').getAppLog();

class Database {

    /**
     * Initializes default settings
     */
    constructor () {
        this._db =  new Pool({
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
            // Performs this query to check the connection to database server
            await this._db.query("SELECT NOW() ");

            console.log('Connected to postgres');

        } catch (e) {
            console.log('Occured error when connecting to postgres. Error:', e.message);
        }
    }

    /**
     * Query data in database and return the result
     */
    async query (..._sql) {
        let result = null;

        const client = await this._db.connect();

        try {
            const { rows } = await client.query(..._sql);

            result = rows;

        } catch (e) {
            log.debug(_sql);
            log.error(e.stack);

        } finally {
            client.release();
        }

        return result;
    }

    getInstance () {
        return this._db;
    }

}

module.exports = new Database();
