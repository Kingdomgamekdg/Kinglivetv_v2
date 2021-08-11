'use strict';

const controller = require('../controllers/general/controller');
const wrap = require('../libs/common').wrapAsync;

module.exports = router => {
  router.get('/traders/total', wrap(controller.getTotalTraders));
};
