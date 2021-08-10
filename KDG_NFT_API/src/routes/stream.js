'use strict';

const controller = require('../controller/stream/controller');
const wrap = require('./../lib/common').wrapAsync;

module.exports = router => {
  router.get('/stream/total-stream-time', wrap(controller.getTotalStreamTime));
};
