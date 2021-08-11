'use strict'

const controller = require('../controllers/stream/controller')
const wrap = require('../libs/common').wrapAsync

module.exports = router => {
  router.get('/stream/total-stream-time', wrap(controller.getTotalStreamTime))
}
