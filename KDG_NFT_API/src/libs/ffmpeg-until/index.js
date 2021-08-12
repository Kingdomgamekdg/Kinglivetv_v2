const ffmpeg = require('fluent-ffmpeg')

const screenshot = (file) => new Promise(resolve => {
    try {
        ffmpeg.setFfmpegPath('src/ffmpeg/ffmpeg')
        ffmpeg.setFfprobePath('src/ffmpeg/ffprobe')
        ffmpeg(file.path)
        .on('end', function () {
            console.log('done')
            resolve()
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent)
        })
        .on('error', function (error) {
            console.log('error  : ', error)
        })
        .screenshots({
            count: 1,
            folder: file.destination,
            size: '700x?',
            filename: file.filename.replace('.mp4', '') + '.png'
        })
    } catch (e) {
        console.log('bug', e)
    }
})

module.exports = screenshot
