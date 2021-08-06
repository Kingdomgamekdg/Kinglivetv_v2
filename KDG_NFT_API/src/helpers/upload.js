const fs = require('fs')
const axios = require('axios');
const auth_headers = { AccessKey: "78e0551c-3f29-4636-9fc525d8dfa1-2973-44f0" }
const { getVideoStatus } = require('../helpers/helpSocket')
async function create_video(title, _id) {
    try {
        const create = await axios.post('https://video.bunnycdn.com/library/1536/videos/', { title }, { headers: auth_headers })
        return create.data.guid
    } catch (error) {
        getVideoStatus(_id, null, 5)
        return null
    }
}


async function upload_video(guid, path, _id) {
    try {
        await axios.put(
            `https://video.bunnycdn.com/library/1536/videos/${guid}`, fs.readFileSync(path),
            {
                'maxContentLength': Infinity,
                'maxBodyLength': Infinity,
                headers: {
                    ...auth_headers,
                    'Content-Type': 'video/mp4'
                }
            }
        )
    } catch (error) {
        getVideoStatus(_id, guid, 5)
    }
}

module.exports = {
    create_video , upload_video
}