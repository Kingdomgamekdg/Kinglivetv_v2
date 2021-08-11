'use strict'

const controller = require('../controllers/asset/controller')
const wrap = require('../libs/common').wrapAsync

module.exports = router => {
  router.get('/assets/total', wrap(controller.getTotalAssets))
}
