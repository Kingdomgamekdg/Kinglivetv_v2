'use strict'

const controller = require('../controllers/stream/controller')

module.exports = router => {
  router.get('/stream/total-stream-time', controller.getTotalStreamTime)
}
