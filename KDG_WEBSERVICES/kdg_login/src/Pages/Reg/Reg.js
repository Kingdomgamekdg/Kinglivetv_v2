import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import callAPI from '../../axios';
import ChooseLanguage from '../../components/ChooseLanguages';
import { useLang } from '../../context/LanguageLayer';
import { validateForm } from '../../helpers';
import { actChangeLoading } from '../../store/action';

export default function Reg() {
  const [{ language, RegPageLanguage }] = useLang();
  const { ref } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [check, setcheck] = useState(false);
  const [CountDownSendMail, setCountDownSendMail] = useState(null);
  const [CountDownSendMailTimeOut, setCountDownSendMailTimeOut] = useState(null);
  const [ValidForm, setValidForm] = useState({
    email: false,
    password: false,
    repassword: false,
    email_code: false,
  });
  const [Eye, setEye] = useState({
    password: false,
    repassword: false,
  });

  useEffect(() => {
    document.title = RegPageLanguage[language].title;
  }, [RegPageLanguage, language]);

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
      //   return message.error(RegPageLanguage[language].not_valid_email);
      // }

      dispatch(actChangeLoading(true));
      try {
        const res = await callAPI.post('/create_code?type=1', { email });
        dispatch(actChangeLoading(false));

        if (res.status === 1) {
          setCountDownSendMail(120);
          message.success(RegPageLanguage[language].sent_email);
        }
        if (res.status === 101) {
          message.error(RegPageLanguage[language].existed_email);
        }
        if (res.status === 102) {
          message.error(RegPageLanguage[language].wait_2_minutes);
        }
      } catch (error) {}
    },
    [dispatch, RegPageLanguage, language]
  );

  const handleReg = useCallback(
    async e => {
      e.preventDefault();
      if (
        !ValidForm.email ||
        !ValidForm.password ||
        !ValidForm.email_code ||
        !ValidForm.repassword ||
        !check
      ) {
        return;
      }

      const data = new FormData(e.target);
      const submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }
      // if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(submitData.email)) {
      //   return message.error(RegPageLanguage[language].not_valid_email);
      // }

      dispatch(actChangeLoading(true));
      try {
        const res = await callAPI.post('/user', submitData);
        dispatch(actChangeLoading(false));

        if (res.status === 1) {
          message.success(RegPageLanguage[language].register_success);
          setTimeout(() => {
            history.push(`/login/${submitData.email}`);
          }, 1000);
        }
        if (res.status === 101) {
          message.error(RegPageLanguage[language].existed_email);
        }
        if (res.status === 102) {
          message.error(RegPageLanguage[language].wrong_code);
        }
      } catch (error) {}
    },
    [dispatch, history, RegPageLanguage, language, ValidForm, check]
  );

  return (
    <>
      <div className='form-block'>
        <div className='left'>
          <img alt='' src='/images/img-login.png'></img>
        </div>
        <div className='right'>
          <form onSubmit={handleReg}>
            <ChooseLanguage />
            <h3>{RegPageLanguage[language].title}</h3>
            <p>
              {RegPageLanguage[language].desc_1}
              <span onClick={() => history.push('/login')}>{RegPageLanguage[language].desc_2}</span>
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
                    e.target.nextElementSibling.innerText =
                      RegPageLanguage[language].not_valid_email;
                    setValidForm({ ...ValidForm, email: false });
                  } else {
                    e.target.nextElementSibling.classList.remove('show');
                    e.target.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, email: true });
                  }
                }}
              />
              <p className='validate-error'></p>
            </div>

            <div className='wrapper'>
              <div className='form-group type-password half'>
                <label htmlFor='password'>{RegPageLanguage[language].password}</label>
                <input
                  id='password'
                  name='password'
                  type={Eye.password ? 'text' : 'password'}
                  onChange={e => {
                    let repassword = document.querySelector('#repassword');
                    if (!e.target.value.match(validateForm.password)) {
                      e.target.nextElementSibling.classList.add('show');
                      e.target.nextElementSibling.innerText =
                        RegPageLanguage[language].error_password;
                      setValidForm({ ...ValidForm, password: false });
                    } else if (e.target.value !== repassword.value) {
                      repassword.nextElementSibling.classList.add('show');
                      repassword.nextElementSibling.innerText =
                        RegPageLanguage[language].password_not_match;
                      setValidForm({ ...ValidForm, repassword: false });
                      e.target.nextElementSibling.classList.remove('show');
                      e.target.nextElementSibling.innerText = '';
                      setValidForm({ ...ValidForm, password: true });
                    } else {
                      repassword.nextElementSibling.classList.remove('show');
                      repassword.nextElementSibling.innerText = '';
                      setValidForm({ ...ValidForm, repassword: true });
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
              <div className='form-group type-password half'>
                <label htmlFor='repassword'>{RegPageLanguage[language].confirm_password}</label>
                <input
                  id='repassword'
                  name='repassword'
                  type={Eye.repassword ? 'text' : 'password'}
                  onChange={e => {
                    let password = document.querySelector('#password');
                    if (e.target.value !== password.value) {
                      e.target.nextElementSibling.classList.add('show');
                      e.target.nextElementSibling.innerText =
                        RegPageLanguage[language].password_not_match;
                      setValidForm({ ...ValidForm, repassword: false });
                    } else {
                      e.target.nextElementSibling.classList.remove('show');
                      e.target.nextElementSibling.innerText = '';
                      setValidForm({ ...ValidForm, repassword: true });
                    }
                  }}
                />
                <span className='validate-error'></span>
                <FontAwesomeIcon
                  className='eye'
                  icon={Eye.repassword ? faEye : faEyeSlash}
                  onClick={() => setEye({ ...Eye, repassword: !Eye.repassword })}
                />
              </div>
            </div>

            <div className='wrapper'>
              <div className='form-group half'>
                <label htmlFor='email_code'>{RegPageLanguage[language].register_code}</label>
                <input
                  id='email_code'
                  name='email_code'
                  onChange={e => {
                    if (!Number(e.target.value) || e.target.value.length !== 6) {
                      e.target.nextElementSibling.classList.add('show');
                      e.target.nextElementSibling.innerText =
                        RegPageLanguage[language].not_valid_register_code;
                      setValidForm({ ...ValidForm, email_code: false });
                    } else {
                      e.target.nextElementSibling.classList.remove('show');
                      e.target.nextElementSibling.innerText = '';
                      setValidForm({ ...ValidForm, email_code: true });
                    }
                  }}
                />
                <span className='validate-error'></span>
              </div>
              <div className='form-group type-button half'>
                <label>Button</label>
                <span
                  onClick={() => getCode(document.getElementById('email').value)}
                  className={`button ${
                    CountDownSendMail === null && ValidForm.email ? 'valid' : 'not-valid'
                  }`}
                >
                  {RegPageLanguage[language].get_code}
                  <span className='count-down'>
                    {CountDownSendMail !== null && CountDownSendMail}
                  </span>
                </span>
                <span></span>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='parent_ref_code'>{RegPageLanguage[language].referral_code}</label>
              <input id='parent_ref_code' name='parent_ref_code' defaultValue={ref ? ref : ''} />
            </div>

            <div className='form-group type-checkbox'>
              <input
                id='confirm'
                name='confirm'
                type='checkbox'
                onChange={e => setcheck(e.target.checked)}
              />
              <label
                htmlFor='confirm'
                dangerouslySetInnerHTML={{ __html: RegPageLanguage[language].agreement }}
              ></label>
            </div>

            <div className='form-group half'>
              <button
                className={`button ${
                  ValidForm.email &&
                  ValidForm.password &&
                  ValidForm.email_code &&
                  ValidForm.repassword &&
                  check
                    ? 'valid'
                    : 'not-valid'
                }`}
              >
                {RegPageLanguage[language].title}
              </button>
              <span></span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
