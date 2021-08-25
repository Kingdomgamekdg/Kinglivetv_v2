'use strict'

const multer = require('multer')
const shortid = require('shortid')

const storage = multer.diskStorage(
    {
        destination: 'uploads/',
        filename: function (req, file, cb) {
            // req.body is empty...
            // How could I get the new_file_name property sent from client here?
            cb(null, shortid.generate())
        }
    }
)


module.exports = multer({ storage: storage ,limits: { fileSize: 31457280 }}, ).fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
])
