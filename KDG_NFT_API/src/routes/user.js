'use strict'

const controller = require('../controllers/user')
const UserValidation = require('../validations/user')
const { isAuthenticated } = require('../middlewares/auth')

module.exports = router => {
  router.post('/login', UserValidation('login'), controller.login)
  // router.put('/{address}', wrap(controller.updateUser))
  router.get('/users/total', controller.getTotalUsers)
  router.get('/users/personal', isAuthenticated, controller.getPersonalInfo)
}
