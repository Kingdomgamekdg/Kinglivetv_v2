'use strict';

const jwt = require('jsonwebtoken');

const config = require('./config');

const HttpError = require('./http-error');

class JWT {

    /**
     * Issues the token for the specified payload data
     */
    issueToken (_payload) {
        return jwt.sign(_payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
        });
    }

    /**
     * Verifies the token to ensure that it is valid
     */
    verifyToken (_token) {
        try {
            // Verifies token and throw error if token is not valid
            return jwt.verify(_token, config.JWT_SECRET);

        } catch (e) {
            return null;
        }
    }

    /**
     * The middleware verifies token that attached in the "api-key" header when perform the request
     */
    authenticate (_req, _res, _next) {
        // No "api-key" header exists on the incoming request, return not authorized
        if (typeof _req.headers['api-key'] === 'undefined') {
            _next(new HttpError(401));
            return;
        }

        // Retrieves the "api-key" header and get the JWT
        const token = _req.headers['api-key'];

        try {
            // Verifies token and throw error if token is not valid
            _req.session = jwt.verify(token, config.JWT_SECRET);

            _next();

        } catch (e) {
            _next(new HttpError(401));
        }
    }

}

module.exports = new JWT();
