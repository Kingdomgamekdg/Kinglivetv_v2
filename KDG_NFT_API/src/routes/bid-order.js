'use strict'

const controller = require('../controllers/bid-order')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.get('/bid-orders/total-transaction', controller.getTotalTransactions)
  router.get('/bid-orders/bidding', isAuthenticated, controller.getBiddingOfUser)
}
