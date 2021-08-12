'use strict'

const controller = require('../controllers/market')
const { isAuthenticated } = require('../middlewares/auth')
const MarketValidation = require('../validations/market')

module.exports = router => {
  router.get('/listing-asset', isAuthenticated, MarketValidation('getListingAsset'), controller.getListingAsset)
  router.get('/top-sellers-quantity', isAuthenticated, MarketValidation('getListingAsset'), controller.getListingAsset)
  router.get('/top-sellers-revenue', isAuthenticated, MarketValidation('getListingAsset'), controller.getListingAsset)
}
