'use strict'

const controller = require('../controllers/ipfs')
const { isAuthenticated } = require('../middlewares/auth')

const image = require('../libs/image')

module.exports = router => {
    router.post('/ipfs', [image.upload, isAuthenticated], controller.uploadMetadata)
}
