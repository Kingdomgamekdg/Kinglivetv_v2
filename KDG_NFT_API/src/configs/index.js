'use strict'
require('dotenv').config()
const config = {}

// Environment variables
const envs = [
    'ENABLE_LOG_FILE',
    'IPFS_HOST',
    'IPFS_PORT',
    'IPFS_GATEWAY',
    // 'JWT_SECRET',
    // 'JWT_EXPIRES_IN',
    'ETHEREUM_NETWORK',
    // 'OPENSEA_API'
    'MONGO_HOST',
    'MONGO_PORT',
    'MONGO_USER',
    'MONGO_PASSWORD',
    'MONGO_DB',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
]

// Checks enviroment variables to ensure that all of them are declared
envs.forEach((env) => {
    if (process.env[env] === undefined) {
        console.log(`Enviroment variable \x1b[33m"${env}"\x1b[0m is required in file \x1b[33m".env"\x1b[0m \n`)
        process.exit(0)
    }

    config[env] = process.env[env]
})

module.exports = config
