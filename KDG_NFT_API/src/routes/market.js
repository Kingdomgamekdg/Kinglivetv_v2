'use strict';

const router = require('express').Router();

const controller = require('../controllers/market/controller');
const wrap = require('../libs/common').wrapAsync;
const {isAuthenticated } = require('../controllers/auth');


module.exports = router => {
    router.get('/listing-asset',isAuthenticated, wrap(controller.getListingAsset));
    router.get('/top-sellers-quantity',isAuthenticated, wrap(controller.getListingAsset));
    router.get('/top-sellers-revenue',isAuthenticated, wrap(controller.getListingAsset));

};
