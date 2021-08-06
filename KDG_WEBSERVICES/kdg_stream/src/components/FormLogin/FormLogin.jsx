import React, { useCallback, useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import * as AiIcon from 'react-icons/ai';
import * as BiIcon from 'react-icons/bi';
import { useLanguage } from '../../context/LanguageLayer';
import loadingSvg from '../../assets/images/login/loading.svg';

import api from '../../axios';
import { storage } from '../../helpers';
import { useHistory } from 'react-router-dom';

const FormLogin = ({ setCurrentForm }) => {
  const [{ language, formLogin }] = useLanguage();
  const history = useHistory();

  const [emailLogin, setEmailLogin] = useState('');
  const [isDirtyEmail, setIsDirtyEmail] = useState(false);
  const [isHaveErrorEmail, setIsHaveErrorEmail] = useState(false);

  const [passwordLogin, setPasswordLogin] = useState('');
  const [isDirtyPassword, setIsDirtyPassword] = useState(false);
  const [isHaveErrorPassword, setIsHaveErrorPassword] = useState(false);

  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDirtyEmail) {
      let isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailLogin);

      isValid ? setIsHaveErrorEmail(false) : setIsHaveErrorEmail(true);
    }
  }, [emailLogin, isDirtyEmail]);

  useEffect(() => {
    if (isDirtyPassword) {
      let isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([0-9a-zA-Z!@#$%^&*]{8,})$/.test(
        passwordLogin
      );

      isValid ? setIsHaveErrorPassword(false) : setIsHaveErrorPassword(true);
    }
  }, [passwordLogin, isDirtyPassword]);

  useEffect(() => {
    isDirtyEmail && !isHaveErrorEmail && isDirtyPassword && !isHaveErrorPassword
      ? setIsValidForm(true)
      : setIsValidForm(false);
  }, [isDirtyEmail, isHaveErrorEmail, isDirtyPassword, isHaveErrorPassword]);

  const handleSubmitForm = useCallback(
    async e => {
      e.preventDefault();

      let formData = {
        email: emailLogin,
        password: passwordLogin,
      };

      try {
        setIsLoading(true);
        const response = await api.post('/authorize', formData);
        setIsLoading(false);
        // console.log(response);

        if (response.status === 1) {
          NotificationManager.success(formLogin[language].message.success, null, 500);
          setTimeout(() => {
            storage.setToken(response.jwtToken);
            history.push('/home');
          }, 1000);
        } else if (response.status === 103) {
          NotificationManager.error(formLogin[language].message.error103, null, 2000);
        } else if (response.status === 104) {
          NotificationManager.error(formLogin[language].message.error104, null, 2000);
        } else if (response.status === 105) {
          NotificationManager.error(formLogin[language].message.error105, null, 2000);
        } else {
          NotificationManager.error(formLogin[language].message.error, null, 2000);
        }
      } catch (error) {
        // console.error(error);
        setIsLoading(false);
        NotificationManager.error(formLogin[language].message.error, null, 2000);
      }
    },
    [emailLogin, passwordLogin, history, formLogin, language]
  );

  return (
    <form className='login-form' onSubmit={handleSubmitForm}>
      <NotificationContainer />
      <p className='login-form__title'>{formLogin[language].title}</p>
      <p className='login-form__subtitle'>
        <span>{formLogin[language].subtitle1} </span>
        <span onClick={() => setCurrentForm('register')}>{formLogin[language].subtitle2}</span>
      </p>
      <div className='form-control'>
        <label htmlFor='emailLogin'>{formLogin[language].email}</label>
        <input
          autoFocus
          id='emailLogin'
          type='email'
          value={emailLogin}
          onChange={e => {
            setEmailLogin(e.target.value);
            setIsDirtyEmail(true);
          }}
        />
        {isHaveErrorEmail && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formLogin[language].errorEmail}</span>
          </p>
        )}
      </div>
      <div className='form-control' style={{ marginBottom: '60px' }}>
        <label htmlFor='passwordLogin'>{formLogin[language].password}</label>
        <input
          id='passwordLogin'
          type={isHidePassword ? 'password' : 'text'}
          value={passwordLogin}
          onChange={e => {
            setPasswordLogin(e.target.value);
            setIsDirtyPassword(true);
          }}
        />
        {isHaveErrorPassword ? (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formLogin[language].errorPassword}</span>
          </p>
        ) : null}
        {isHidePassword ? (
          <AiIcon.AiFillEye
            onClick={() => setIsHidePassword(!isHidePassword)}
            className='password-icon'
          />
        ) : (
          <AiIcon.AiFillEyeInvisible
            onClick={() => setIsHidePassword(!isHidePassword)}
            className='password-icon'
          />
        )}
      </div>
      <div style={{ textAlign: 'right', marginBottom: '5px' }}>
        <button className='button-submitForm' disabled={!isValidForm || isLoading}>
          {formLogin[language].login}
          <img src={loadingSvg} alt='' style={{ display: `${isLoading ? 'block' : 'none'}` }} />
        </button>
      </div>
      <p className='forgot-password' onClick={() => setCurrentForm('forgot')}>
        {formLogin[language].forgotPassword}
      </p>
    </form>
  );
};

export default FormLogin;
