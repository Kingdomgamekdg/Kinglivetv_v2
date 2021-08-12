'use strict'

const controller = require('../controllers/market')
const { isAuthenticated } = require('../middlewares/auth')
const MarketValidation = require('../validations/market')

module.exports = router => {
  router.get('/listing-asset', isAuthenticated, MarketValidation('getListingAsset'), controller.getListingAsset)
}
