const NodeMediaServer = require('node-media-server')
const { model } = require('mongoose')
const Streams = model('streams')

const { MNS_CONFIG } = require('./configs/constant')
const nms = new NodeMediaServer(MNS_CONFIG)
const { getStreamStatus } = require('./helpers/helpSocket')
nms.run()

nms.on('prePublish', async (id, StreamPath, args) => {
    const streamKey = getStreamKeyFromStreamPath(StreamPath)
    const stream = await Streams.findOne({ key: streamKey, status: { $ne: 2 } })
    if (stream) {
        stream.connect_status = 1
        stream.last_start = new Date()
        await stream.save()

        setTimeout(() => {
            getStreamStatus(stream.user)
        }, 9000)
    }
    if (!stream) {
        const session = nms.getSession(id)
        if (session)session.reject()
    }
})

nms.on('donePublish', async (id, StreamPath, args) => {
    const streamKey = getStreamKeyFromStreamPath(StreamPath)
    const stream = await Streams.findOne({ key: streamKey })
    if (stream) {
        stream.connect_status = 0
        // stream.length += (Date.now() - new Date(stream.last_start).getTime()) / 1000
        await stream.save()
        getStreamStatus(stream.user)
    }
})

const getStreamKeyFromStreamPath = (path) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
}

// nms.on('postConnect', (id, args) => {
//   console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
// });

// nms.on('doneConnect', (id, args) => {
//   console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
// });

// nms.on('prePublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postPublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('donePublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('prePlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postPlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('donePlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });
