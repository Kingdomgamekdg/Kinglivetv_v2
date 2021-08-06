import callapi from '../axios';
import Axios from 'axios';

export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_NEWS = 'CHANGE_NEWS';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_LIST_CATEGORIES = 'CHANGE_LIST_CATEGORIES';
export const CHANGE_CURRENT_URL = 'CHANGE_CURRENT_URL';
export const CHANGE_ROUTER = 'CHANGE_ROUTER';

export function actChangeLoading(loading) {
  return {
    type: CHANGE_LOADING,
    payload: { loading },
  };
}

export function actChangeNews(news) {
  return {
    type: CHANGE_NEWS,
    payload: { news },
  };
}

export function atcChangeLanguage(lang) {
  return {
    type: CHANGE_LANGUAGE,
    payload: { lang },
  };
}

export function actChangeCurrentUrl(url) {
  return {
    type: CHANGE_CURRENT_URL,
    payload: { url },
  };
}

export function actChangeRouter(router) {
  return {
    type: CHANGE_ROUTER,
    payload: { router },
  };
}

export function actChangeSettings(settings) {
  return {
    type: CHANGE_SETTINGS,
    payload: { settings },
  };
}

export function actChangeListCategories(categories) {
  return {
    type: CHANGE_LIST_CATEGORIES,
    payload: { categories },
  };
}

export function actChangeListContries(contries) {
  return {
    type: CHANGE_SETTINGS,
    payload: { contries },
  };
}

export function asyncGetNews(skip, take, search, language) {
  return async dispatch => {
    try {
      var res = await callapi.get(`/news?skip=${skip}&take=${take}&search=${search}&language=${language}`);
      dispatch(actChangeNews(res.data));
      return res;
    } catch (error) {
      return error;
    }
  };
}

export function asyncGetNewsById(id, next, language) {
  return async dispatch => {
    try {
      var res = await callapi.get(`/get_by_id_news/${id}?next=${next}&language=${language}`);
      return res;
    } catch (error) {
      return error;
    }
  };
}

export function asyncGetListContries() {
  return async dispatch => {
    dispatch(actChangeLoading(true));
    const res = (await Axios.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')).data;
    dispatch(actChangeListContries(res));
    dispatch(actChangeLoading(false));
  };
}

export function asyncGetSettings(hasLoading = true) {
  return async dispatch => {
    try {
      hasLoading && dispatch(actChangeLoading(true));
      var res = await callapi.get(`/setting`);
      const setting = {};
      res.forEach(el => (setting[el.key] = el.data));
      dispatch(actChangeSettings(setting));
      hasLoading && dispatch(actChangeLoading(false));
      return res;
    } catch (error) {
      hasLoading && dispatch(actChangeLoading(false));
      return error;
    }
  };
}
