'use strict'

const controller = require('../controllers/user')
const UserValidation = require('../validations/user')
module.exports = router => {
    router.post('/login', UserValidation('login'), controller.login)
    // router.put('/{address}', wrap(controller.updateUser))
    router.get('/users/total', controller.getTotalUsers)
}
