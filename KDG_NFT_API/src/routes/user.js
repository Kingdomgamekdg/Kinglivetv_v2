'use strict';

const router = require('express').Router();

const controller = require('./../controller/user/controller');
const wrap = require('./../lib/common').wrapAsync;


module.exports = router => {
    router.post('/login', wrap(controller.login));
    router.put('/{address}', wrap(controller.updateUser));
    router.get('/users/total', wrap(controller.getTotalUsers));
};
