const keyJwt = 'jwt'
const keyRefresh = 'refresh'

const storage = {
  getToken() {
    try {
      return JSON.parse(localStorage.getItem(keyJwt))
    } catch {
      return null
    }
  },

  setToken(jwtToken) {
    localStorage.setItem(keyJwt, JSON.stringify(jwtToken))
  },

  clearToken() {
    localStorage.removeItem(keyJwt)
  },

  getRefresh() {
    return JSON.parse(localStorage.getItem(keyRefresh))
  },

  setRefresh(refreshToken) {
    localStorage.setItem(keyRefresh, JSON.stringify(refreshToken))
  },

  clearRefresh() {
    localStorage.removeItem(keyRefresh)
  },

  getItem(key) {
    return JSON.parse(localStorage.getItem(key))
  },

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  clearItem(key) {
    localStorage.removeItem(key)
  },
}

export default storage
