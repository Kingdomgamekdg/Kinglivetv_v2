import React, { useCallback, useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import * as AiIcon from 'react-icons/ai';
import * as BiIcon from 'react-icons/bi';
import { useLanguage } from '../../context/LanguageLayer';
import loadingSvg from '../../assets/images/login/loading.svg';

import api from '../../axios';

const FormForgot = ({ setCurrentForm }) => {
  const [{ language, formForgot }] = useLanguage();

  const [emailForgot, setEmailForgot] = useState('');
  const [isDirtyEmail, setIsDirtyEmail] = useState(false);
  const [isHaveErrorEmail, setIsHaveErrorEmail] = useState(false);

  const [passwordForgot, setPasswordForgot] = useState('');
  const [isDirtyPassword, setIsDirtyPassword] = useState(false);
  const [isHaveErrorPassword, setIsHaveErrorPassword] = useState(false);

  const [confirmPasswordForgot, setConfirmPasswordForgot] = useState('');
  const [isDirtyConfirmPassword, setIsDirtyConfirmPassword] = useState(false);
  const [isHaveErrorConfirmPassword, setIsHaveErrorConfirmPassword] = useState(false);

  const [codeForgot, setCodeForgot] = useState('');

  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDirtyEmail) {
      let isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailForgot);

      isValid ? setIsHaveErrorEmail(false) : setIsHaveErrorEmail(true);
    }
  }, [emailForgot, isDirtyEmail]);

  useEffect(() => {
    if (isDirtyPassword) {
      let isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([0-9a-zA-Z!@#$%^&*]{8,})$/.test(
        passwordForgot
      );

      isValid ? setIsHaveErrorPassword(false) : setIsHaveErrorPassword(true);
    }
  }, [passwordForgot, isDirtyPassword]);

  useEffect(() => {
    if (isDirtyConfirmPassword) {
      let isValid = passwordForgot === confirmPasswordForgot;

      isValid ? setIsHaveErrorConfirmPassword(false) : setIsHaveErrorConfirmPassword(true);
    }
  }, [confirmPasswordForgot, passwordForgot, isDirtyConfirmPassword]);

  useEffect(() => {
    isDirtyEmail &&
    !isHaveErrorEmail &&
    isDirtyPassword &&
    !isHaveErrorPassword &&
    isDirtyConfirmPassword &&
    !isHaveErrorConfirmPassword &&
    codeForgot !== ''
      ? setIsValidForm(true)
      : setIsValidForm(false);
  }, [
    isDirtyEmail,
    isHaveErrorEmail,
    isDirtyPassword,
    isHaveErrorPassword,
    isDirtyConfirmPassword,
    isHaveErrorConfirmPassword,
    codeForgot,
  ]);

  const handleSubmitForm = useCallback(
    async e => {
      e.preventDefault();

      let formData = {
        email: emailForgot,
        new_password: passwordForgot,
        forgot_password_code: codeForgot,
      };
      setIsLoading(true);

      try {
        const response = await api.post('/forgot_password', formData);
        // console.log(response);
        setIsLoading(false);

        if (response.status === 1) {
          NotificationManager.success(formForgot[language].submit.success, null, 500);
          setTimeout(() => {
            setCurrentForm('login');
          }, 1000);
        } else if (response.status === 100) {
          NotificationManager.error(formForgot[language].submit.error100, null, 2000);
        } else if (response.status === 101) {
          NotificationManager.error(formForgot[language].submit.error101, null, 2000);
        } else if (response.status === 102) {
          NotificationManager.error(formForgot[language].submit.error102, null, 2000);
        } else {
          NotificationManager.error(formForgot[language].submit.error, null, 2000);
        }
      } catch (error) {
        // console.error(error);
        setIsLoading(false);
        NotificationManager.error(formForgot[language].submit.error, null, 2000);
      }
    },
    [emailForgot, passwordForgot, codeForgot, formForgot, language, setCurrentForm]
  );

  const handleGetCode = useCallback(async () => {
    let formData = {
      email: emailForgot,
    };
    setIsLoading(true);

    try {
      const response = await api.post('/create_forgot_password_code', formData);
      // console.log(response);
      setIsLoading(false);

      if (response.status === 1) {
        NotificationManager.success(formForgot[language].getCodeEvent.success, null, 2000);
      } else if (response.status === 100) {
        NotificationManager.error(formForgot[language].getCodeEvent.error100, null, 2000);
      } else if (response.status === 101) {
        NotificationManager.error(formForgot[language].getCodeEvent.error101, null, 2000);
      } else {
        NotificationManager.error(formForgot[language].getCodeEvent.error, null, 2000);
      }
    } catch (error) {
      // console.error(error);
      setIsLoading(false);
      NotificationManager.error(formForgot[language].getCodeEvent.error, null, 2000);
    }
  }, [emailForgot, formForgot, language]);

  return (
    <form className='login-form' onSubmit={handleSubmitForm}>
      <NotificationContainer />
      <p className='login-form__title'>{formForgot[language].title}</p>
      <p className='login-form__subtitle'>
        <span>{formForgot[language].subtitle1} </span>
        <span onClick={() => setCurrentForm('login')}>{formForgot[language].subtitle2}</span>
      </p>
      <div className='form-control'>
        <label htmlFor='emailForgot'>{formForgot[language].email}</label>
        <input
          autoFocus
          id='emailForgot'
          type='email'
          value={emailForgot}
          onChange={e => {
            setEmailForgot(e.target.value);
            setIsDirtyEmail(true);
          }}
        />
        {isHaveErrorEmail && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formForgot[language].errorEmail}</span>
          </p>
        )}
      </div>
      <div className='form-control' style={{ marginBottom: '60px' }}>
        <label htmlFor='passwordForgot'>{formForgot[language].password}</label>
        <input
          id='passwordForgot'
          type={isHidePassword ? 'password' : 'text'}
          value={passwordForgot}
          onChange={e => {
            setPasswordForgot(e.target.value);
            setIsDirtyPassword(true);
          }}
        />
        {isHaveErrorPassword && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formForgot[language].errorPassword}</span>
          </p>
        )}
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
      <div className='form-control'>
        <label htmlFor='confirmPasswordForgot'>{formForgot[language].confirmPassword}</label>
        <input
          id='confirmPasswordForgot'
          type={isHidePassword ? 'password' : 'text'}
          value={confirmPasswordForgot}
          onChange={e => {
            setConfirmPasswordForgot(e.target.value);
            setIsDirtyConfirmPassword(true);
          }}
        />
        {isHaveErrorConfirmPassword && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formForgot[language].errorConfirmPassword}</span>
          </p>
        )}
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
      <div className='layout-form-2'>
        <div className='form-control'>
          <label htmlFor='codeForgot'>{formForgot[language].codeReset}</label>
          <input
            id='codeForgot'
            type='text'
            value={codeForgot}
            onChange={e => {
              setCodeForgot(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            className='button-getCode'
            type='button'
            disabled={isHaveErrorEmail || !isDirtyEmail || isLoading}
            onClick={handleGetCode}
          >
            {formForgot[language].getCode}
            <img
              src={loadingSvg}
              alt=''
              style={{
                display: `${isLoading ? 'block' : 'none'}`,
              }}
            />
          </button>
        </div>
      </div>
      <div style={{ textAlign: 'right', marginBottom: '5px' }}>
        <button className='button-submitForm' disabled={!isValidForm || isLoading}>
          {formForgot[language].change}
          <img src={loadingSvg} alt='' style={{ display: `${isLoading ? 'block' : 'none'}` }} />
        </button>
      </div>
    </form>
  );
};

export default FormForgot;
