'use strict'

const controller = require('../controllers/buys')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/buys/total-volume', controller.getTotalAssetVolume)
  router.get('/buys/total-transaction', controller.getTotalTransactions)
  router.get('/buys/bidding', isAuthenticated, controller.getBiddingOfUser)
}
