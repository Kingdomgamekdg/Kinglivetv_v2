'use strict'

const controller = require('../controllers/bid-order')

module.exports = router => {
  router.get('/bid-orders/total-transaction', controller.getTotalTransactions)
}
