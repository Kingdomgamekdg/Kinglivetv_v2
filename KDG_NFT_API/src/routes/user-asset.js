'use strict'

const controller = require('../controllers/user-asset/controller')
const wrap = require('../libs/common').wrapAsync
const { isAuthenticated } = require('../controllers/auth')

module.exports = router => {
    router.get('/user-asset', isAuthenticated, wrap(controller.getUserAsset))
}
