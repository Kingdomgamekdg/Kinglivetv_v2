'use strict'

const controller = require('../controllers/market')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/market/get-top-assets', isAuthenticated, controller.getTopSellAssets)
  router.get('/market/get-top-populate', isAuthenticated, controller.getTopPopulateAssets)
  router.get('/market/get-market-by-ids', isAuthenticated, controller.getMarketByIds)
}
