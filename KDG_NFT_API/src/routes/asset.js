'use strict';

const controller = require('../controller/asset/controller');
const wrap = require('./../lib/common').wrapAsync;

module.exports = router => {
  router.get('/assets/total', wrap(controller.getAssetsTotal));
};
