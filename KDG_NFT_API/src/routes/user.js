'use strict'

const controller = require('../controllers/user/controller')
const wrap = require('../libs/common').wrapAsync

module.exports = router => {
    router.post('/login', wrap(controller.login))
    router.put('/{address}', wrap(controller.updateUser))
    router.get('/users/total', wrap(controller.getTotalUsers))
}
