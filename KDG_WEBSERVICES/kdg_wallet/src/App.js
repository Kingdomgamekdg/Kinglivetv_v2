import 'antd/dist/antd.css';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import Menu from './Components/Menu';
import Popup from './Components/Popup';
import { useLang } from './context/LanguageLayer';
import { CHANGE_LANGUAGE } from './context/reducer';
import { storage } from './helpers';
import Account from './Pages/Account';
import Home from './Pages/Home';
import Staking from './Pages/Staking';
import StakingHistory from './Pages/StakingHistory';
import Wallet from './Pages/Wallet';
import socket from './socket';
import { actChangeBalances, actChangeUser, asyncInitAuth } from './store/authAction';

export default function App() {
  const [, disp] = useLang();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.loading);
  const location = useLocation();
  const refresh = new URLSearchParams(location.search).get('refresh');

  useMemo(() => {
    if (refresh) {
      storage.setRefresh(refresh);
      dispatch(asyncInitAuth());
    } else {
      const old_refresh = storage.getRefresh();
      if (!old_refresh) {
        window.open('https://login.kingdomgame.org', '_self');
      } else {
        dispatch(asyncInitAuth());
      }
    }
  }, [refresh, dispatch]);

  useEffect(() => {
    const listenBalance = res => {
      dispatch(actChangeBalances(res.balances));
    };
    const listenUser = res => {
      dispatch(actChangeUser(res.data));
    };
    socket.on('balances', listenBalance);
    socket.on('user', listenUser);
  }, [dispatch]);

  useEffect(() => {
    let languageStorage = storage.getLanguage();
    languageStorage && disp({ type: CHANGE_LANGUAGE, payload: languageStorage });
  }, [disp]);

  return (
    <>
      {isLoading && <Loading />}
      <Menu />
      <Popup />
      <Switch>
        <Route exact={true} path={`/`}>
          <Home />
        </Route>
        <Route exact={true} path={`/wallet`}>
          <Wallet />
        </Route>
        <Route exact={true} path={`/staking`}>
          <Staking />
        </Route>
        <Route exact={true} path={`/staking/history`}>
          <StakingHistory />
        </Route>
        <Route exact={true} path={`/account`}>
          <Account />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}
