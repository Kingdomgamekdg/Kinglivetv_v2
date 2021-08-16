'use strict'

const controller = require('../controllers/user-asset')
const { isAuthenticated } = require('../middlewares/auth')
const UserAssetValidation = require('../validations/user-asset')

module.exports = router => {
    router.get('/user-asset', isAuthenticated, UserAssetValidation('getAssets'), controller.getUserAsset)
    router.get('/user-assets-by-ids', isAuthenticated, controller.getUserAssetByIds)
}
