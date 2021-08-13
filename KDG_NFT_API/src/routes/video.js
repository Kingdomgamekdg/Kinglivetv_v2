'use strict'

const controller = require('../controllers/video')

module.exports = router => {
  router.get('/videos/total', controller.getTotalVideos)
}
