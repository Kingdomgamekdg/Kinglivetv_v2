import React, { useCallback, useEffect, useState } from 'react';
import * as RiIcon from 'react-icons/ri';
import * as GoIcon from 'react-icons/go';
import * as IoIcon from 'react-icons/io';
import * as VscIcon from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Avatar, PopupBox, QR } from '..';
import '../../assets/css/header.css';
import kdgCoin from '../../assets/images/kdg-coin.svg';
import logo from '../../assets/images/logo.png';
import logoText from '../../assets/images/logotext.png';
import languageIcon from '../../assets/images/userinfo/language.svg';
import tutorialIcon from '../../assets/images/userinfo/tutorial.svg';
import logoutIcon from '../../assets/images/userinfo/logout.svg';
import profileIcon from '../../assets/images/userinfo/profile.svg';
import callAPI from '../../axios';
import {
  BREAK_POINT_992,
  BREAK_POINT_EXTRA_SMALL,
  BREAK_POINT_SMALL,
  STORAGE_DOMAIN,
} from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { CHANGE_LANGUAGE } from '../../context/reducer';
import { convertBalance, convertDateAgo, storage } from '../../helpers';
import { useNumber, useWindowSize } from '../../hooks';
import { actChangeUnreadNoti } from '../../store/action';

const handleShowPopper =
  (fnMain, ...fnSubs) =>
  () => {
    fnMain(x => !x);
    fnSubs.forEach(fnSub => fnSub());
  };

const Header = () => {
  const [{ listLanguage, flag, header, language }, dispatchLanguage] = useLanguage();

  const [width] = useWindowSize();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const unreadNoti = useSelector(state => state.unreadNoti);
  const noties = useSelector(state => state.noties);
  const balanceKDG = convertBalance(useSelector(state => state.balanceKDG));

  const user = useSelector(state => state.user);
  const uid = user?._id;
  const email = user?.email;
  const last_name = user?.kyc.last_name;
  const first_name = user?.kyc.first_name;
  const followNumber = useNumber(user?.kinglive?.total_follower);

  const [showSearch, setShowSearch] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const handleNavigation = useCallback(
    pathname => {
      if (location.pathname !== pathname) {
        history.push(pathname);
      }
    },
    [location, history]
  );

  const handleReaded = useCallback(async () => {
    if (unreadNoti > 0) {
      await callAPI.post('/readed');
      dispatch(actChangeUnreadNoti(0));
    }
  }, [unreadNoti, dispatch]);

  const handleType = useCallback(
    ({ type, data }) => {
      let text = header[language]['noti' + type];
      if (type === 101) text = text.replace('data1', data.name);
      if (type === 102) text = text.replace('data1', data.name).replace('data2', data.video_name);
      if (type === 103) text = text.replace('data1', data.video_name);
      if (type === 104) text = text.replace('data1', data.name).replace('data2', data.video_name);
      if (type === 105) text = text.replace('data1', data.name);
      return text;
    },
    [header, language]
  );

  const handleClickNoti = useCallback(
    ({ type, data }) => {
      if (type === 101) history.push(`/profile?uid=${data.user}`);
      if (type === 102 || type === 103 || type === 104) history.push(`/watch?v=${data.video}`);
      if (type === 105) history.push(`/live?s=${data.video}`);
    },
    [history]
  );

  useEffect(() => {
    const handleHidePopper1 = () => {
      showNoti && setShowNoti(false);
      showInfo && setShowInfo(false);
      showLanguage && setShowLanguage(false);
    };

    const handleHidePopper2 = e => {
      if (e.keyCode !== 27) return;
      showNoti && setShowNoti(false);
      showInfo && setShowInfo(false);
      showLanguage && setShowLanguage(false);
    };

    document.addEventListener('click', handleHidePopper1);
    window.addEventListener('keyup', handleHidePopper2);

    return () => {
      document.removeEventListener('click', handleHidePopper1);
      window.removeEventListener('keyup', handleHidePopper2);
    };
  }, [showNoti, showInfo, showLanguage]);

  return (
    <div className='header'>
      {showSearch && (
        <div className='header__searchBarContainer'>
          <IoIcon.IoMdArrowBack
            className='header__iconHover mr-20'
            onClick={() => setShowSearch(false)}
          />
          <form method='get' action='/result' className='header__searchBar'>
            <button type='submit' className='header__searchIcon1 header__iconHover'>
              <IoIcon.IoMdSearch />
            </button>
            <input type='text' name='search' placeholder={header[language].search} />
          </form>
        </div>
      )}

      {showDeposit && (
        <PopupBox onCancel={setShowDeposit}>
          <QR onCancel={setShowDeposit} />
        </PopupBox>
      )}

      <div className={`popper ${showNoti ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
        <div className='main__title main__title--right pl-25 pr-25'>
          <p>{header[language].notification}</p>
        </div>

        {noties?.length === 0 ? (
          <div className='header__emptyNotification'>
            <p>{header[language].notihere}</p>
            <p>{header[language].notidesc1}</p>
          </div>
        ) : (
          noties?.map(o => (
            <div
              key={o._id}
              onClick={() => {
                handleClickNoti(o);
                setShowNoti(false);
              }}
              className={`header__notiItem ${o.status === 0 ? 'header__notiItem--unread' : ''}`}
            >
              <p>{handleType(o)}</p>
              <p className='date'>{convertDateAgo(o.last_update)}</p>
            </div>
          ))
        )}
      </div>

      <div
        className={`popper popper--language ${showLanguage ? 'show' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className='header__language'>{header[language].language}</div>
        <div className='bt bb'>
          {Object.keys(listLanguage).map(lan => (
            <div
              key={lan}
              className='header__manage'
              onClick={() => {
                dispatchLanguage({ type: CHANGE_LANGUAGE, payload: lan });
                setShowLanguage(false);
              }}
            >
              <img className='icon' src={flag[lan]} alt='' />
              <span>{listLanguage[lan]}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`popper popper--userinfo ${showInfo ? 'show' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className='header__info'>
          <div
            onClick={() => {
              window.scrollTo(0, 0);
              history.push(`/profile?uid=${uid}`);
              setShowInfo(false);
            }}
          >
            <Avatar
              src={user?.kyc.avatar ? STORAGE_DOMAIN + user?.kyc.avatar?.path : undefined}
              position={user?.kyc.avatar_pos}
            />
          </div>
          <div>
            <p className='header__info-name'>
              {first_name || last_name ? `${first_name} ${last_name}` : email}
            </p>
            <p className='header__info-follow'>
              {followNumber} {header[language].followers}
            </p>
            <div className='header__info-balance'>
              <div>{balanceKDG}</div>
              <div>
                <img src={kdgCoin} alt='coin' />
              </div>
              <div
                onClick={() => {
                  setShowDeposit(true);
                  setShowInfo(false);
                }}
              >
                {header[language].deposit}
              </div>
            </div>
          </div>
        </div>
        <div className='bt bb'>
          <div
            className='header__manage'
            onClick={() => {
              window.scrollTo(0, 0);
              history.push('/profile?uid=' + user?._id);
              setShowInfo(false);
            }}
          >
            <img className='icon' src={profileIcon} alt='' />
            <span>{header[language].personalinfo}</span>
          </div>

          <div
            className='header__manage'
            onClick={() => {
              setShowInfo(false);
              setShowLanguage(true);
            }}
          >
            <img className='icon' src={languageIcon} alt='' />
            <span>{header[language].language}</span>
          </div>

          <div
            className='header__manage'
            onClick={() => {
              setShowInfo(false);
              window.open('/tutorial.pdf', '_blank');
            }}
          >
            <img className='icon' src={tutorialIcon} alt='' />
            <span>{header[language].tutorial}</span>
          </div>
        </div>
        <div
          className='header__manage'
          onClick={() => {
            setShowInfo(false);
            storage.clearRefresh();
            storage.clearToken();
            history.replace('/home');
            window.open('https://login.kingdomgame.org/logout', '_self');
          }}
        >
          <img className='icon' src={logoutIcon} alt='' />
          <span>{header[language].logout}</span>
        </div>
      </div>

      <div className='header__left'>
        <div
          className='header__logo'
          onClick={() => {
            window.scrollTo(0, 0);
            handleNavigation('/home');
          }}
        >
          {width > BREAK_POINT_EXTRA_SMALL ? (
            <img src={logoText} alt='logo' />
          ) : (
            <img src={logo} alt='logo' />
          )}
        </div>

        {width > BREAK_POINT_SMALL ? (
          <form method='get' action='/result' className='header__search'>
            <button type='submit' className='header__searchIcon1 header__iconHover'>
              <IoIcon.IoMdSearch />
            </button>
            <input type='text' name='search' placeholder={header[language].search} />
          </form>
        ) : (
          <IoIcon.IoMdSearch
            className='header__iconHover ml-20'
            onClick={() => setShowSearch(true)}
          />
        )}
      </div>

      <div className='header__right'>
        {user && (
          <>
            <button className='button header__button mr-10' onClick={() => history.push('/upload')}>
              {width > BREAK_POINT_992 ? (
                header[language].upload
              ) : (
                <GoIcon.GoCloudUpload className='icon' />
              )}
            </button>

            <button
              className={`button header__button ${width > BREAK_POINT_992 ? 'active' : ''} ${
                width <= BREAK_POINT_EXTRA_SMALL ? 'mr-20' : 'mr-40'
              }`}
              onClick={() => history.push('/setup')}
            >
              {width > BREAK_POINT_992 ? (
                header[language].setup
              ) : (
                <RiIcon.RiLiveLine className='icon' />
              )}
            </button>

            <div
              onClick={handleShowPopper(setShowNoti, handleReaded)}
              className={`header__noti header__iconHover ${
                width <= BREAK_POINT_EXTRA_SMALL ? 'mr-20' : 'mr-40'
              }`}
            >
              {unreadNoti > 0 && (
                <span className='header__noti-unread'>
                  <span>{unreadNoti <= 99 ? unreadNoti : '99+'}</span>
                </span>
              )}
              <VscIcon.VscBell />
            </div>

            <div className='header__avatar' onClick={handleShowPopper(setShowInfo)}>
              <Avatar
                src={user?.kyc.avatar ? STORAGE_DOMAIN + user?.kyc.avatar?.path : undefined}
                position={user?.kyc.avatar_pos}
              />
            </div>
          </>
        )}

        {!user && (
          <div className='header__login' onClick={() => handleNavigation('/login')}>
            {header[language].login}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
