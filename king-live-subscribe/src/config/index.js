'use strict';

const config = {};

// Environment variables
const envs = [
    'PORT',
    'PG_HOST',
    'PG_PORT',
    'PG_USER',
    'PG_PASS',
    'PG_DB_NAME',
    'IPFS_HOST',
    'IPFS_PORT',
    'IPFS_GATEWAY',
    'ENABLE_LOG_FILE',
    'ETHEREUM_NODE',
    'MONGO_HOST',
    'MONGO_PORT',
    'MONGO_USER',
    'MONGO_PASSWORD',
    'MONGO_DB',
    'MARKET_CONTRACT',
    '1155_CONTRACT',
    'ADDRESS_0',
    'NOITY_URL'
];

// Checks enviroment variables to ensure that all of them are declared
envs.forEach((env) => {
    if (process.env[env] === undefined) {
        console.log(`Enviroment variable \x1b[33m"${env}"\x1b[0m is required in file \x1b[33m".env"\x1b[0m \n`);
        process.exit(0);
    }

    config[env] = process.env[env];
});

module.exports = config;
