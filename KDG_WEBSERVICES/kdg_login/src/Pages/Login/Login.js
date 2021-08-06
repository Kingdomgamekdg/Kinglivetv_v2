import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';
import { validateForm } from '../../helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { asyncLogin } from '../../store/authAction';
import { actChangeLoading } from '../../store/action';
import ChooseLanguage from '../../components/ChooseLanguages';
import { useLang } from '../../context/LanguageLayer';

export default function Login() {
  const [{ language, LoginPageLanguage }] = useLang();
  const { email } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [ValidForm, setValidForm] = useState({ email: false, password: true });
  const [Eye, setEye] = useState({ password: false });

  useEffect(() => {
    document.title = LoginPageLanguage[language].title;
  }, [LoginPageLanguage, language]);

  useEffect(() => {
    if (email) setValidForm(valid => ({ ...valid, email: true }));
  }, [email]);

  const handleLogin = useCallback(
    async e => {
      e.preventDefault();
      if (!ValidForm.email && !ValidForm.password) {
        return;
      }

      const data = new FormData(e.target);
      const submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }

      dispatch(actChangeLoading(true));
      try {
        const res = await dispatch(asyncLogin(submitData));
        dispatch(actChangeLoading(false));

        if (res.status === 1) {
          history.push('/services');
        }
        if (res.status === 101) {
          message.error(LoginPageLanguage[language].email_not_existed);
        }
        if (res.status === 102) {
          message.error(LoginPageLanguage[language].wrong_email_or_password);
        }
      } catch (error) {}
    },
    [dispatch, history, LoginPageLanguage, language, ValidForm]
  );

  return (
    <>
      <div className='form-block'>
        <div className='left'>
          <img alt='' src='/images/img-login2.png'></img>
        </div>
        <div className='right'>
          <form onSubmit={handleLogin}>
            <ChooseLanguage />
            <h3>{LoginPageLanguage[language].title}</h3>
            <p>
              {LoginPageLanguage[language].desc_1}
              <span onClick={() => history.push('/reg')}>{LoginPageLanguage[language].desc_2}</span>
            </p>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                defaultValue={email}
                onChange={e => {
                  e.target.value = e.target.value.toLowerCase();
                  if (!e.target.value.match(validateForm.email)) {
                    e.target.nextElementSibling.classList.add('show');
                    e.target.nextElementSibling.innerText = LoginPageLanguage[language].not_valid_email;
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
            <div className='form-group type-password'>
              <label htmlFor='password'>{LoginPageLanguage[language].password}</label>
              <input
                id='password'
                name='password'
                type={Eye.password ? 'text' : 'password'}
                onChange={e => {
                  if (!e.target.value.match(validateForm.password)) {
                    e.target.nextElementSibling.classList.add('show');
                    e.target.nextElementSibling.innerText = LoginPageLanguage[language].error_password;
                    setValidForm({ ...ValidForm, password: false });
                  } else {
                    e.target.nextElementSibling.classList.remove('show');
                    e.target.nextElementSibling.innerText = '';
                    setValidForm({ ...ValidForm, password: true });
                  }
                }}
                placeholder={LoginPageLanguage[language].error_password}
              />
              <span className='validate-error'></span>
              <FontAwesomeIcon
                className='eye'
                icon={Eye.password ? faEye : faEyeSlash}
                onClick={e => setEye({ ...Eye, password: !Eye.password })}
              />
            </div>

            <div className='form-group half'>
              <button className={`button ${ValidForm.email && ValidForm.password ? 'valid' : 'not-valid'}`}>
                {LoginPageLanguage[language].title}
              </button>
              <span></span>
            </div>

            <div>
              <span
                style={{ fontSize: 14, cursor: 'pointer', color: '#fac800' }}
                onClick={() => history.push('/forgot-password')}
              >
                {LoginPageLanguage[language].forgot_password}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
