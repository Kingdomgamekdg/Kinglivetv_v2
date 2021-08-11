'use strict'

require('dotenv').config()

const pgtools = require('pgtools')
const chalk = require('chalk')
const fs = require('fs')

const database = require('../libs/database')
const config = require('../configs')
// const log = require('./../libs/logger').getAppLog();

class Setup {
    /**
     * Creates database
     */
    async createDb () {
        try {
            await pgtools.createdb({
                host: config.PG_HOST,
                port: config.PG_PORT,
                user: config.PG_USER,
                password: config.PG_PASS
            }, config.PG_DB_NAME)

            console.log(`Create database '${config.PG_DB_NAME}' ${chalk.green.bold('√')}`)
        } catch (e) {
            console.log(e.message)
        }
    }

    /**
     * Creates schema
     */
    async createSchema () {
        await database.query('CREATE SCHEMA IF NOT EXISTS KING_LIVE')

        console.log(`Create schema 'api' ${chalk.green.bold('√')}`)
    }

    /**
     * Creates tables
     */
    async createTables () {
        const path = './src/database/tables'

        const files = fs.readdirSync(path)

        for (const file of files) {
            const sql = fs.readFileSync(`${path}/${file}`, 'utf8')

            const result = await database.query(sql)

            if (result === undefined || result != null) {
                console.log(`Create table '${file.split('.')[0]}' ${chalk.green.bold('√')}`)
            }
        }
    }

    /**
     * Creates functions
     */
    async createFunctions () {
        const path = './src/database/functions'

        const folders = fs.readdirSync(path)

        for (const folder of folders) {
            const files = fs.readdirSync(`${path}/${folder}`)

            for (const file of files) {
                const sql = fs.readFileSync(`${path}/${folder}/${file}`, 'utf8')

                const result = await database.query(sql)

                if (result === undefined || result != null) {
                    console.log(`Create function '${file.split('.')[0]}' ${chalk.green.bold('√')}`)
                }
            }
        }
    }

    /**
     * Runs
     */
    async run () {
        console.log('Installing database ...')

        // await this.createDb();

        await database.connect()

        await this.createSchema()
        // await this.createTables();
        await this.createFunctions()

        console.log('Done')

        process.exit(0)
    }
}

(new Setup()).run()
