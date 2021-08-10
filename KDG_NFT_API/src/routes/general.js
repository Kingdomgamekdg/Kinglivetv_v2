'use strict';

const controller = require('../controller/general/controller');
const wrap = require('./../lib/common').wrapAsync;

module.exports = router => {
  router.get('/traders/total', wrap(controller.getTotalTraders));
};
