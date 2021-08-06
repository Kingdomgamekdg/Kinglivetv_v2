'use strict';

const log4js = require('log4js');

class Logger {

    /**
     * Initializes default settings
     */
    constructor () {
        this._enableLogFile = process.env.ENABLE_LOG_FILE;

        log4js.configure(require('./log4j'));
    }

    /**
     * Gets access logger
     */
    getAccessLog () {
        return log4js.connectLogger(this._enableLogFile ? log4js.getLogger('access') : log4js.getLogger());
    }

    /**
     * Gets application logger
     */
    getAppLog () {
        return this._enableLogFile ? log4js.getLogger('app') : log4js.getLogger();
    }

    /**
     * Gets socket logger
     */
    getSocketLog () {
        return this._enableLogFile ? log4js.getLogger('socket') : log4js.getLogger();
    }

}

module.exports = new Logger();
