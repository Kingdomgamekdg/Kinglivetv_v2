'use strict'

const controller = require('../controllers/asset')

module.exports = router => {
  router.get('/assets/total', controller.getTotalAssets)
}
