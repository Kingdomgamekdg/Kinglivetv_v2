'use strict'

const controller = require('../controllers/asset')
const AssetValidation = require('../validations/asset')

module.exports = router => {
  router.get('/assets/total', AssetValidation('getTotalAssets'), controller.getTotalAssets)
}
