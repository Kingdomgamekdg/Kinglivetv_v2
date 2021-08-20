import io from 'socket.io-client'
import { refreshToken } from './axios'
import { WS_DOMAIN } from './constant'
import storage from './helpers/storage'

const token = storage.getToken()
const socket = io(WS_DOMAIN, {
  auth: {
    token: token,
    type: 2,
  },
})

socket.on('connect', async () => {
  console.log("socket.on 'connect'")
})

socket.on('connect_error', (r) => {
  console.log("socket.on 'connect_error'", r)
})

socket.on('disconnect', (r) => {
  if (r === 'io server disconnect') {
    // console.log({ r })
    setTimeout(async () => {
      await refreshToken()
      const token = await storage.getToken()
      if (token) {
        socket.auth.token = token
        socket.connect()
      }
    }, 1000)
  }
})

export default socket
