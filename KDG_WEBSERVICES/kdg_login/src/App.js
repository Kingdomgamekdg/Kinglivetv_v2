import 'antd/dist/antd.css';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import './assets/scss/login-reg.scss';
import Loading from './components/Loading';
import { storage } from './helpers';
import Forgot from './Pages/Forgot';
import Login from './Pages/Login';
import Reg from './Pages/Reg';
import Services from './Pages/Services';
import { asyncInitAuth } from './store/authAction';

export default function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoading = useSelector(state => state.loading);

  const initLogin = useCallback(async () => {
    if (window.location.pathname.includes('logout')) {
      storage.clearToken();
      storage.clearRefresh();
      history.push('/');
    }
    const { status } = await dispatch(asyncInitAuth());

    if (status === 1) history.push('/services');
  }, [dispatch, history]);

  useMemo(() => {
    initLogin();
  }, [initLogin]);

  return (
    <>
      {isLoading && <Loading />}
      <Route exact={true} path={`/`}>
        <Login />
      </Route>
      <Route exact={true} path={`/login/:email?`}>
        <Login />
      </Route>
      <Route exact={true} path={`/login/:email?`}>
        <Login />
      </Route>
      <Route exact={true} path={`/reg/:ref?`}>
        <Reg />
      </Route>
      <Route exact={true} path='/forgot-password'>
        <Forgot />
      </Route>
      <Route exact={true} path='/services'>
        <Services />
      </Route>
    </>
  );
}
