import callAPI from '../axios'
import storage from '../helpers/storage'

export const CHANGE_USER = 'CHANGE_USER'
export function actChangeUser(user) {
  return { type: CHANGE_USER, payload: user }
}
export function asyncChangeUser() {
  return async (dispatch) => {
    try {
      const res = await callAPI.get('/user')

      if (res.status === 1) {
        dispatch(actChangeUser(res.data))
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
export const CHANGE_UNREAD_NOTI = 'CHANGE_UNREAD_NOTI';

export function actChangeUnreadNoti(unreadNoti) {
  return {
    type: CHANGE_UNREAD_NOTI,
    payload: unreadNoti,
  };
}
export function actChangeNoties(noties) {
  return {
    type: CHANGE_NOTI,
    payload: noties,
  };
}
export function asyncGetNoti() {
  return async dispatch => {
    const res = await callAPI.get('/noti');
    console.log(res);
    dispatch(actChangeNoties(res.data));
    dispatch(actChangeUnreadNoti(res.unread));
  };
}