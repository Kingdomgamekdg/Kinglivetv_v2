'use strict'

const controller = require('../controllers/general/controller')

module.exports = router => {
  router.get('/traders/total', controller.getTotalTraders)
}
