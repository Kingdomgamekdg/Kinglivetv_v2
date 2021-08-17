'use strict'

const controller = require('../controllers/asset')
const AssetValidation = require('../validations/asset')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/assets/total', AssetValidation('getTotalAssets'), controller.getTotalAssets)
  router.get('/assets', [isAuthenticated], controller.getAsset)
}
