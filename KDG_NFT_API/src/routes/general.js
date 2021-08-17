'use strict'

const controller = require('../controllers/general')

module.exports = router => {
  router.get('/traders/total', controller.getTotalTraders)
  router.get('/top-sellers-quantity', controller.getTopSellerQuantity)
  router.get('/top-sellers-revenue', controller.getTopSellerRevenue)
}
