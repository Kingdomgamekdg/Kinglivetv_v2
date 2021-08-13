'use strict'

const controller = require('../controllers/viewed')

module.exports = router => {
  router.get('/views/total', controller.getTotalViewed)
}
