'use strict'

const controller = require('../controllers/activity')

module.exports = router => {
  router.get('/activities/volume-donate', controller.getVolumeDonate)
}
