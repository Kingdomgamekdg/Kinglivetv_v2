'use strict'

const controller = require('../controllers/market')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/market/get-top-assets', controller.getTopSellAssets)
  router.get('/market/get-top-populate', controller.getTopPopulateAssets)
  router.get('/market/get-market-by-ids', controller.getMarketByIds)
}
