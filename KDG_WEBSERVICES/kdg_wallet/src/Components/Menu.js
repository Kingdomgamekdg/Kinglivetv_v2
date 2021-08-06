import { faSignOutAlt, faUser, faUserCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { useLang } from '../context/LanguageLayer';
import { CHANGE_LANGUAGE } from '../context/reducer';
import { checkLanguage, storage } from '../helpers';
import routes from '../routes';

export default function Menu() {
  const [{ language, listLanguage }, disp] = useLang();
  const [currentUrl, setCurrentUrl] = useState('/');
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);

  const handleClick = useCallback(
    (selectedItem, event, isURL, havepath) => {
      var path, pathEN;
      if (havepath) {
        path = havepath.path;
        pathEN = havepath.pathEN;
      }
      if (pathEN) {
        window.open(checkLanguage({ vi: path, en: pathEN }, language), '_blank');
      }
      if (!pathEN) {
        if (selectedItem !== '') {
          if (selectedItem !== 'null') {
            if (event) event.stopPropagation();
            setCurrentUrl(selectedItem);
            history.push(selectedItem);
          }
        }
      }
    },
    [history, language]
  );

  useEffect(() => {
    if (window.innerWidth < 992) {
      document.querySelectorAll('.menu > li').forEach(el => {
        var submenu = el.querySelector('ul');
        if (submenu) {
          el.addEventListener('click', e => {
            e.preventDefault();
            if (Array.from(el.classList).indexOf('show') === -1) el.classList.add('show');
            else el.classList.remove('show');
          });
        }
      });
      document.querySelector('.menubar').addEventListener('click', e => {
        var menu = document.querySelector('header .bottom-header .logo-menu');
        if (Array.from(menu.classList).indexOf('show') === -1) menu.classList.add('show');
        else menu.classList.remove('show');
      });
      document.querySelector('.mask-menu').addEventListener('click', () => {
        document.querySelector('header .bottom-header .logo-menu').classList.remove('show');
      });
    }
  }, []);

  const user = useSelector(state => state.user);
  const lastMenu = useCallback(() => {
    if (user) {
      return (
        <li
          className='account-menu'
          onClick={e => {
            if (window.innerWidth > 992) {
              var dropdown = e.currentTarget.querySelector('.drop-down-account');
              if (Array.from(dropdown.classList).includes('active')) dropdown.classList.remove('active');
              else dropdown.classList.add('active');
            } else {
              handleClick('/account', e);
            }
          }}
        >
          <FontAwesomeIcon size='2x' color='#fac800' icon={faUserCircle} />
          <div className='drop-down-account'>
            <div className='top-dropdown'>
              <FontAwesomeIcon style={{ verticalAlign: 'middle' }} icon={faUser} size='2x' />
              <div>
                <p>
                  {(user.kyc?.first_name || user.kyc?.last_name) && `${user.kyc?.first_name} ${user.kyc?.last_name}`}
                </p>
                <p>{user.email}</p>
              </div>
            </div>
            <div onClick={e => handleClick('/account', e)} className='bottom-dropdown'>
              <FontAwesomeIcon icon={faUserEdit} color='#283349' />
              <span> {checkLanguage({ vi: 'Tài khoản', en: 'Account' }, language)} </span>
            </div>
            <div
              onClick={() => {
                storage.clearToken();
                window.open('https://login.kingdomgame.org/logout', '_self');
              }}
              className='bottom-dropdown'
            >
              <FontAwesomeIcon icon={faSignOutAlt} color='#283349' />
              <span> {checkLanguage({ vi: 'Đăng xuất', en: 'Logout' }, language)} </span>
            </div>
          </div>
        </li>
      );
    }
  }, [user, handleClick, language]);

  return (
    <>
      <header>
        <div class='kdg-container'>
          <div class='top-header'>
            <div class='social'>
              <a target='_blank' rel='noopener noreferrer' href='https://www.facebook.com/KingdomGameGlobal'>
                <img alt='' src='https://storage.kingdomgame.org/upload/5f3be4aaf150a43976d10bc0.png' />
              </a>
              <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/KingdomGame_KDG'>
                <img alt='' src='https://storage.kingdomgame.org/upload/5f3be4b1f150a43976d10bc2.png' />
              </a>
              <a target='_blank' rel='noopener noreferrer' href='https://t.me/kdg_en'>
                <img alt='' src='https://storage.kingdomgame.org/upload/5f3be4aef150a43976d10bc1.png' />
              </a>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.youtube.com/channel/UCl7ezf4kJUxjlPJwaoPtapA/featured'
              >
                <img alt='' src='https://storage.kingdomgame.org/upload/5f3be4b3f150a43976d10bc3.png' />
              </a>
              <a target='_blank' rel='noopener noreferrer' href='https://medium.com/kingdom-game-4-0'>
                <img alt='' src='https://storage.kingdomgame.org/upload/5f4204e51d5f8472ee487c3f.svg' />
              </a>
            </div>
            <div>
              <svg
                width='1em'
                aria-hidden='true'
                focusable='false'
                data-prefix='fas'
                data-icon='envelope'
                class='svg-inline--fa fa-envelope fa-w-16'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                color='#fac800'
              >
                <path
                  fill='currentColor'
                  d='M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z'
                ></path>
              </svg>
              <span class='mail'>contact@kingdomgame.co</span>
            </div>
            <div class='lang'>
              <span>{listLanguage[language]}</span>
              <svg
                width='0.625em'
                aria-hidden='true'
                focusable='false'
                data-prefix='fas'
                data-icon='caret-down'
                class='svg-inline--fa fa-caret-down fa-w-10 '
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 320 512'
              >
                <path
                  fill='currentColor'
                  d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'
                ></path>
              </svg>
              <ul class='dropdown'>
                <li
                  onClick={() => {
                    storage.setLanguage('en');
                    disp({ type: CHANGE_LANGUAGE, payload: 'en' });
                  }}
                >
                  EN
                </li>
                <li
                  onClick={() => {
                    storage.setLanguage('vi');
                    disp({ type: CHANGE_LANGUAGE, payload: 'vi' });
                  }}
                >
                  VI
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='bottom-header'>
          <div className='kdg-container logo-menu'>
            <span class='menubar'>
              <img
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAjUlEQVQokd3TPQ5BURRF4e8+dxw6hZ/CgJgApYiWRslQXmsILzELhUoM4IVQCBpE7lVZ9ck6O2fnhLoyQxsXaQSUEUN0EyV3jhFTNHFKlDSwDXWVF2W5mYMiT/PkZ6JQVyboybtRGTFAPzPQIWLh1to5UVKg+uPWIsZoef1rATusvhGN0Pkws8f6zaIHV6vzHP5LNQegAAAAAElFTkSuQmCC'
                alt=''
              />
            </span>
            <span className='mask-menu'></span>
            <a className='logo' href='/'>
              <img alt='KingDomGame' src={logo} />
            </a>
            <h1>KINGDOM GAME 4.0</h1>
            <ul className='menu'>
              <a className='logo' href='/'>
                <img alt='KingDomGame' src={logo} />
              </a>
              {routes.map(router => (
                <li
                  key={router.path}
                  className={`${currentUrl === router.path ? 'active' : ''} hover`}
                  onClick={e => {
                    handleClick(router.path, e, router.isURL, {
                      path: router.path,
                      pathEN: router.pathEN,
                    });
                  }}
                >
                  <span>{router.name[language]}</span>
                </li>
              ))}
              {lastMenu()}
              <span className='language'>
                <li
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => {
                    storage.setLanguage('en');
                    disp({ type: CHANGE_LANGUAGE, payload: 'en' });
                  }}
                >
                  EN
                </li>
                <li
                  className={language === 'vi' ? 'active' : ''}
                  onClick={() => {
                    storage.setLanguage('vi');
                    disp({ type: CHANGE_LANGUAGE, payload: 'vi' });
                  }}
                >
                  VI
                </li>
              </span>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
