import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { validateForm } from '../../helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { actChangeLoading } from '../../store/action';
import callapi from '../../axios';
import ChooseLanguage from '../../components/ChooseLanguages';
import { useLang } from '../../context/LanguageLayer';

export default function Forgot() {
  const [{ language, ForgotPageLanguage }] = useLang();
  const history = useHistory();
  const dispatch = useDispatch();

  const [CountDownSendMail, setCountDownSendMail] = useState(null);
  const [CountDownSendMailTimeOut, setCountDownSendMailTimeOut] = useState(null);
  const [ValidForm, setValidForm] = useState({
    email: false,
    password: false,
    new_password: false,
    forgot_password_code: false,
  });
  const [Eye, setEye] = useState({
    password: false,
    new_password: false,
  });

  // const loginURL = useSelector(state => {
  //   return state.settings && state.settings.login_button.url;
  // });

  useEffect(() => {
    document.title = ForgotPageLanguage[language].title;
  }, [ForgotPageLanguage, language]);

  useEffect(() => {
    if (CountDownSendMail !== null) {
      if (CountDownSendMail <= 0) {
        setCountDownSendMail(null);
      }
      if (CountDownSendMail > 0) {
        var timeout = setTimeout(() => {
          setCountDownSendMail(CountDownSendMail - 1);
        }, 1000);
        setCountDownSendMailTimeOut(timeout);
      }
    }
  }, [CountDownSendMail]);

  const getCode = useCallback(
    async email => {
      // if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      //   return message.error(ForgotPageLanguage[language].not_valid_email);
      // }

      dispatch(actChangeLoading(true));
      try {
        const res = await callapi.post('/create_code?type=2', { email });
        dispatch(actChangeLoading(false));

        if (res.status === 1) {
          setCountDownSendMail(120);
          message.success(ForgotPageLanguage[language].sent_email);
        }
        if (res.status === 101) {
          message.error(ForgotPageLanguage[language].existed_email);
        }
        if (res.status === 102) {
          message.error(ForgotPageLanguage[language].wait_2_minutes);
        }
      } catch (error) {}
    },
    [dispatch, ForgotPageLanguage, language]
  );

  const handleResetPass = useCallback(
    async e => {
      e.preventDefault();
      if (!ValidForm.email || !ValidForm.password || !ValidForm.forgot_password_code || !ValidForm.new_password) {
        return;
      }

      const data = new FormData(e.target);
      const submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }

      // if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(submitData.email)) {
      //   return message.error(ForgotPageLanguage[language].not_valid_email);
      // }

      dispatch(actChangeLoading(true));
      try {
        const res = await callapi.post('/forgot_password', submitData);
        dispatch(actChangeLoading(false));
        if (res.status === 1) {
          message.success(ForgotPageLanguage[language].reset_password_success);
          setTimeout(() => {
            history.push(`/login/${submitData.email}`);
          }, 1000);
        }
        if (res.status === 101) {
          message.error(ForgotPageLanguage[language].not_existed_email);
        }
        if (res.status === 102) {
          message.error(ForgotPageLanguage[language].wrong_code);
        }
      } catch (error) {}
    },
    [dispatch, history, ForgotPageLanguage, language, ValidForm]
  );

  return (
    <>
      <div className='form-block'>
        <div className='left'>
          <img alt='' src='/images/img-login.png'></img>
        </div>
        <div className='right'>
          <form onSubmit={handleResetPass}>
            <ChooseLanguage />
            <h3>{ForgotPageLanguage[language].reset_password}</h3>
            <p>
              {ForgotPageLanguage[language].desc1}
              <span onClick={() => history.push('/login')}>{ForgotPageLanguage[language].desc2}</span>
            </p>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                onChange={e => {
                  e.target.value = e.target.value.toLowerCase();
                  setCountDownSendMail(null);
                  clearTimeout(CountDownSendMailTimeOut);
                  if (!e.target.value.match(validateForm.email)) {
                    e.target.nextElementSibling.classList.add('show');
                    e.target.nextElementSibling.innerText = ForgotPageLanguage[language].not_valid_email;
                    setValidForm({ ...ValidForm, email: false });
                  } else {
                    e.target.nextElementSibling.classList.remove('show');
                    e.target.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, email: true });
                  }
                }}
              />
              <span className='validate-error'></span>
            </div>

            <div className='wrapper'>
              <div className='form-group half'>
                <label htmlFor='forgot_password_code'>{ForgotPageLanguage[language].code_reset_password}</label>
                <input
                  id='forgot_password_code'
                  name='forgot_password_code'
                  onChange={e => {
                    if (!Number(e.target.value) || e.target.value.length !== 6) {
                      e.target.nextElementSibling.classList.add('show');
                      e.target.nextElementSibling.innerText =
                        ForgotPageLanguage[language].not_valid_code_reset_password;
                      setValidForm({ ...ValidForm, forgot_password_code: false });
                    } else {
                      e.target.nextElementSibling.classList.remove('show');
                      e.target.nextElementSibling.innerText = '';
                      setValidForm({ ...ValidForm, forgot_password_code: true });
                    }
                  }}
                />
                <span className='validate-error'></span>
              </div>
              <div className='form-group type-button half'>
                <label>Button</label>
                <span
                  onClick={() => getCode(document.getElementById('email').value)}
                  className={`button ${CountDownSendMail === null && ValidForm.email ? 'valid' : 'not-valid'}`}
                >
                  {ForgotPageLanguage[language].get_code}
                  <span className='count-down'>{CountDownSendMail !== null && CountDownSendMail}</span>
                </span>
                <span></span>
              </div>
            </div>

            <div className='form-group type-password'>
              <label htmlFor='password'>{ForgotPageLanguage[language].new_password}</label>
              <input
                id='password'
                name='password'
                type={Eye.password ? 'text' : 'password'}
                onChange={e => {
                  let new_password = document.querySelector('#new_password');
                  if (!e.target.value.match(validateForm.password)) {
                    e.target.nextElementSibling.classList.add('show');
                    e.target.nextElementSibling.innerText = ForgotPageLanguage[language].error_password;
                    setValidForm({ ...ValidForm, password: false });
                  } else if (e.target.value !== new_password.value) {
                    new_password.nextElementSibling.classList.add('show');
                    new_password.nextElementSibling.innerText = ForgotPageLanguage[language].password_not_match;
                    setValidForm({ ...ValidForm, new_password: false });
                    e.target.nextElementSibling.classList.remove('show');
                    e.target.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, password: true });
                  } else {
                    new_password.nextElementSibling.classList.remove('show');
                    new_password.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, new_password: true });
                  }
                }}
              />
              <span className='validate-error'></span>
              <FontAwesomeIcon
                className='eye'
                icon={Eye.password ? faEye : faEyeSlash}
                onClick={() => setEye({ ...Eye, password: !Eye.password })}
              />
            </div>

            <div className='form-group type-password'>
              <label htmlFor='new_password'>{ForgotPageLanguage[language].confirm_password}</label>
              <input
                id='new_password'
                name='new_password'
                type={Eye.new_password ? 'text' : 'password'}
                onChange={e => {
                  let password = document.querySelector('#password');
                  if (e.target.value !== password.value) {
                    e.target.nextElementSibling.classList.add('show');
                    e.target.nextElementSibling.innerText = ForgotPageLanguage[language].password_not_match;
                    setValidForm({ ...ValidForm, new_password: false });
                  } else {
                    e.target.nextElementSibling.classList.remove('show');
                    e.target.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, new_password: true });
                  }
                }}
              />
              <span className='validate-error'></span>
              <FontAwesomeIcon
                className='eye'
                icon={Eye.new_password ? faEye : faEyeSlash}
                onClick={() => setEye({ ...Eye, new_password: !Eye.new_password })}
              />
            </div>

            <div className='form-group half'>
              <button
                className={`button ${
                  ValidForm.email && ValidForm.password && ValidForm.forgot_password_code && ValidForm.new_password
                    ? 'valid'
                    : 'not-valid'
                }`}
              >
                {ForgotPageLanguage[language].reset_password}
              </button>
              <span></span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
