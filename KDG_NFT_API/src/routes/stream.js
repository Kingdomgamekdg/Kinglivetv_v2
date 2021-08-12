'use strict'

const controller = require('../controllers/stream')

module.exports = router => {
  router.get('/stream/total-stream-time', controller.getTotalStreamTime)
}
