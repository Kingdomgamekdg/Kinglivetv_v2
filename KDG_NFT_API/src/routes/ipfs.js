'use strict';

const router = require('express').Router();

const controller = require('../controllers/ipfs/controller');
const wrap = require('../libs/common').wrapAsync;
const {isAuthenticated} =  require('../controllers/auth');

const image = require('../libs/image');


module.exports = router => {
    router.post('/ipfs', [image.upload,isAuthenticated], wrap(controller.uploadMetadata));
};
