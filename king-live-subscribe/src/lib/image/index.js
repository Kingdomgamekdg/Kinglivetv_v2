'use strict';

const lib1 = require('@gumlet/gif-resize');
const lib2 = require('sharp');

class Image {

    /**
     * Resizes original image into smaller images
     */
    async resize (_image, _widths, _mimetype) {
        const images = [];

        _widths.reverse();

        for (const width of _widths) {
            if (_mimetype === 'image/gif') {
                images.unshift(await lib1({ width })(_image));

            } else {
                images.unshift(await lib2(_image).resize({ width }).toBuffer());
            }

            _image = images[0];
        }

        return images;
    }

}

module.exports = new Image();
