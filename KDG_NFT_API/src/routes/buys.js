'use strict'

const controller = require('../controllers/buys')

module.exports = router => {
  router.get('/buys/total-volume', controller.getTotalAssetVolume)
}
