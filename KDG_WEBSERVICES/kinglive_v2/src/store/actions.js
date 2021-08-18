import callAPI from '../axios'
import storage from '../helpers/storage'

export const CHANGE_USER = 'CHANGE_USER'
export function asyncChangeUser() {
  return async (dispatch) => {
    try {
      const res = await callAPI.get('/user')

      if (res.status === 1) {
        dispatch({ type: CHANGE_USER, payload: res.data })
        storage.setItem('user', res.data)
      }

      if (res.status === 401) {
        console.log('get user failed cuz unauthorized')
      }
    } catch (error) {
      console.log('error get user')
      console.log(error)
    }
  }
}

export const CHANGE_ADDRESS = 'CHANGE_ADDRESS'
export function actChangeAddress(address) {
  return { type: CHANGE_ADDRESS, payload: address }
}

export const CHANGE_NOTI = 'CHANGE_NOTI'
export function asyncGetNoti() {
  return async (dispatch) => {
    try {
      console.log(123);
      const res = await callAPI.get('/noti')
      console.log(res);
      dispatch({ type: CHANGE_NOTI, payload: res.data })
    } catch (error) {
    }
  }
}
