'use strict'

const controller = require('../controllers/general')

module.exports = router => {
  router.get('/traders/total', controller.getTotalTraders)
}
