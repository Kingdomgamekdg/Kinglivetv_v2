const {STRING_SOCKET,socket_server} = require('../configs/constant')
const {io} = require('socket.io-client')
const socket = io(
    socket_server,
    {
        auth : {
            token : STRING_SOCKET,
            type : 1
        }
    }
)
socket.on('connect'  , () => console.log('connect'))
module.exports = {
    getVideoStatus : async (_id,guid,status) => {
        socket.emit('video_status', {_id ,guid, status})
    },
    getUser : async (_id) => {
        socket.emit('user', _id)
    },
    getStreamStatus : async (_id) => {
        socket.emit('stream', _id)
    }
}