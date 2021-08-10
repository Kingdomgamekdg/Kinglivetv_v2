'use strict';

const router = require('express').Router();

const controller = require('../controller/user-asset/controller');
const wrap = require('./../lib/common').wrapAsync;
const {isAuthenticated } = require('../controller/auth');


module.exports = router => {
    router.get('/user-asset',isAuthenticated, wrap(controller.getUserAsset));
};
