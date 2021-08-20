'use strict'

const controller = require('../controllers/activity')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/activities/volume-donate', controller.getVolumeDonate)
  router.get('/activities/histories', isAuthenticated, controller.getHistoryDonates)
}
