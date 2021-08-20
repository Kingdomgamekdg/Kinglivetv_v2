'use strict'

const controller = require('../controllers/listing-asset')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/listing-assets', isAuthenticated, controller.getList)
}
