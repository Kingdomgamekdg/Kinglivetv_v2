const axios = require('axios')
require('dotenv').config();
const config = require('../config');

function create() {
  var Axios = axios.create({
    baseURL: config.NOITY_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return Axios
}

const callAPI = {
    get: async (url, reget = true, config = {}) => {
      var res = (await create().get(url,config)).data
      if (res.status === 401) {
        if (reget) {
          return await refreshToken('get', url)
        }
        storage.clearRefresh()
        storage.clearToken()
        return { status: 0 }
      }
      return res
    },
    post: async (url, body, reget = true, config = {}) => {
      var res = (await create().post(url, body, config)).data
      if (res.status === 401) {
        if (reget) {
          return await refreshToken('post', url, body)
        }
        storage.clearRefresh()
        storage.clearToken()
        return { status: 0 }
      }
      return res
    },
    put: async (url, body, reget = true) => {
      var res = (await create().put(url, body)).data
      if (res.status === 401) {
        if (reget) {
          return await refreshToken('put', url, body)
        }
        storage.clearRefresh()
        storage.clearToken()
        return { status: 0 }
      }
      return res
    },
    delete: async (url, body, reget = true) => {
      var res = (await create().delete(url, body)).data
      if (res.status === 401) {
        if (reget) {
          return await refreshToken('delete', url, body)
        }
        storage.clearRefresh()
        storage.clearToken()
        return { status: 0 }
      }
      return res
    },
  }

module.exports = callAPI
