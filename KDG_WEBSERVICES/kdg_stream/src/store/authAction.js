import callAPI from '../axios';
import { storage } from '../helpers';
import { actChangeUnreadNoti } from './action';

export const CHANGE_USER = 'CHANGE_USER';
export const CHANGE_NOTIES = 'CHANGE_NOTIES';
export const CHANGE_BALANCE = 'CHANGE_BALANCE';
export const CHANGE_ADDRESS_KDG = 'CHANGE_ADDRESS_KDG';
export const CHANGE_BALANCE_KDG = 'CHANGE_BALANCE_KDG';

export function actChangeUser(user) {
  return {
    type: CHANGE_USER,
    payload: { user },
  };
}

export function asyncGetUser() {
  return async dispatch => {
    const res = await callAPI.get('/user');
    storage.setItem('user', res.data);
    dispatch(actChangeUser(res.data));
  };
}

export function actChangeBalances(balances) {
  return {
    type: CHANGE_BALANCE,
    payload: { balances },
  };
}

export function actChangeBalanceKDG(balanceKDG) {
  return {
    type: CHANGE_BALANCE_KDG,
    payload: { balanceKDG },
  };
}

export function actChangeAddressKDG(addressKDG) {
  return {
    type: CHANGE_ADDRESS_KDG,
    payload: { addressKDG },
  };
}

export function asyncGetBalances() {
  return async dispatch => {
    const res = await callAPI.get('/balances');
    dispatch(actChangeBalances(res.balances));
    const balance = res.balances.find(o => o.coin.code === 'KDG-BEP20');
    dispatch(actChangeBalanceKDG(balance.balance));
    dispatch(actChangeAddressKDG(balance.wallet.address));
  };
}

export function asyncLogin(formData) {
  return async dispatch => {
    const res = await callAPI.post('/login', formData);
    if (res.status === 1) {
      await dispatch(asyncInitAuth(res.refreshToken, res.jwt));
    }
    return res;
  };
}

export function actChangeNoties(noties) {
  return {
    type: CHANGE_NOTIES,
    payload: { noties },
  };
}
export function asyncGetNoties() {
  return async dispatch => {
    const res = await callAPI.get('/noti');
    dispatch(actChangeNoties(res.data));
    dispatch(actChangeUnreadNoti(res.unread));
  };
}

export const CHANGE_GIFTS = 'CHANGE_GIFTS';

export function actChangeGifts(gifts) {
  return {
    type: CHANGE_GIFTS,
    payload: { gifts },
  };
}

export function asyncInitGifts() {
  return async dispatch => {
    const res = await callAPI.get('/gifts');
    dispatch(actChangeGifts(res.data));
  };
}

export const CHANGE_GIFTS_STORAGE = 'CHANGE_GIFTS_STORAGE';

export function actChangeGiftStorage(giftStorage) {
  return {
    type: CHANGE_GIFTS_STORAGE,
    payload: { giftStorage },
  };
}

export function asyncInitGiftStorage() {
  return async dispatch => {
    const res = await callAPI.get('/storage_gift');
    dispatch(actChangeGiftStorage(res.data));
  };
}

export function asyncInitAuth(_refresh, _jwt) {
  return async dispatch => {
    if (!_refresh) {
      const refresh = storage.getRefresh();
      if (!refresh) return;
      const resToken = await callAPI.post('/refresh', { refresh_token: refresh });
      if (resToken.status === 1) {
        storage.setToken(resToken.jwt);
        storage.setRefresh(resToken.refreshToken);
      }
    }

    if (_refresh && _jwt) {
      storage.setToken(_jwt);
      storage.setRefresh(_refresh);
    }

    await Promise.all([
      dispatch(asyncGetUser()),
      dispatch(asyncGetBalances()),
      dispatch(asyncGetNoties()),
      dispatch(asyncInitGifts()),
      dispatch(asyncInitGiftStorage()),
    ]);
  };
}
