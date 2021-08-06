const keyToken = 'jwt';
const keyRefresh = 'refresh';
const keyLanguage = 'language';

const Storage = {
  setToken(token) {
    localStorage.setItem(keyToken, JSON.stringify(token));
  },

  getToken() {
    const data = localStorage.getItem(keyToken);
    if (data) return JSON.parse(data);
    else return null;
  },

  clearToken() {
    localStorage.clear(keyToken);
  },

  setRefresh(token) {
    localStorage.setItem(keyRefresh, JSON.stringify(token));
  },

  getRefresh() {
    const data = localStorage.getItem(keyRefresh);
    if (data) return JSON.parse(data);
    else return null;
  },

  clearRefresh() {
    localStorage.clear(keyRefresh);
  },

  setLanguage(token) {
    localStorage.setItem(keyLanguage, JSON.stringify(token));
  },

  getLanguage() {
    const data = localStorage.getItem(keyLanguage);
    if (data) return JSON.parse(data);
    else return null;
  },

  clearLanguage() {
    localStorage.clear(keyLanguage);
  },

  setItem(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
  },

  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },
};

export default Storage;
