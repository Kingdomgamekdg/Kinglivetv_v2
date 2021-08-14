'use strict'

const controller = require('../controllers/stream')

module.exports = router => {
  router.get('/streams/total-stream-time', controller.getTotalStreamTime)
  router.get('/streams/total-streamer', controller.getTotalStreamer)
}
