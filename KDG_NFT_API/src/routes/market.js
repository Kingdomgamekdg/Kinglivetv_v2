'use strict';

const router = require('express').Router();

const controller = require('./../controller/market/controller');
const wrap = require('./../lib/common').wrapAsync;
const {isAuthenticated } = require('../controller/auth');


module.exports = router => {
    router.get('/listing-asset',isAuthenticated, wrap(controller.getListingAsset));
    router.get('/top-sellers-quantity',isAuthenticated, wrap(controller.getListingAsset));
    router.get('/top-sellers-revenue',isAuthenticated, wrap(controller.getListingAsset));

};
