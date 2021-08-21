'use strict'

const sharp = require('sharp')
const path = require('path')
const gifResize = require('@gumlet/gif-resize')
const validate = require('./multer')
const screenshot = require('../ffmpeg-until')
const HttpError = require('./../http-error')
const Promise = require('bluebird')

class Image {
    /**
     * The middlewares handles the uploaded file based on the conditions that is declared in multer.js
     */
    async upload (_req, _res, _next) {
        validate(_req, _res, async (err) => {
            if (err) {
                _next(new HttpError(400, err.message))
                return
            }
            const { image, file } = _req.files
            try {
                if (file) {
                    if (['.mp4'].includes(path.extname(file[0].originalname).toLowerCase())) {
                       await screenshot(file[0]).then(() => {
                                _req.body.image = {
                                    originalname: file[0].originalname.replace('.mp4', '') + '.png',
                                    mimetype: 'image/png',
                                    destination: file[0].destination,
                                    filename: file[0].filename.replace('.mp4', ''),
                                    path: file[0].path.replace('.mp4', '') + '.png'
                                }
                            })
                    }
                }
                        // _req.body.image = file[0];
                if (image) {
                    _req.body.image = image[0]

                    if (!['.png', '.jpg', '.gif', '.jpeg'].includes(path.extname(image[0].originalname).toLowerCase())) {
                        _next(new HttpError(400, 'Image extension is not valid'))
                        return
                    }
                }
                _req.body.file = file[0]
                _next()
            } catch (e) {
                console.log(e)
                _next(new HttpError(400, e.message))
            }
        })
    }

    /**
     * Resizes image
     */
    async resize (_image, _widths, _mimetype) {
        const promises = []

        _widths.forEach((width) => {
            // if (_mimetype === 'image/gif') {
            //     promises.push(
            //         new Promise((resolve, reject) => { gifResize({ width })(_image).then(data => { resolve(data) }).catch(ex =>console.log("Ex",ex)) })
            //     )
            // } else {
                promises.push(
                    sharp(_image).resize({ width, fit: 'inside' }).flatten({ background: '#ffffff' }).toBuffer()
                )
            // }
        })

        return await Promise.all(promises)
    }
}

module.exports = new Image()
