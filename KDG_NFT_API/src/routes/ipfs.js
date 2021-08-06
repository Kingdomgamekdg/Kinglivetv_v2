'use strict';

const router = require('express').Router();

const controller = require('./../controller/ipfs/controller');
const wrap = require('./../lib/common').wrapAsync;
const {isAuthenticated} =  require('./../controller/auth');

const image = require('./../lib/image');


module.exports = router => {
    router.post('/ipfs', [image.upload,isAuthenticated], wrap(controller.uploadMetadata));
};
