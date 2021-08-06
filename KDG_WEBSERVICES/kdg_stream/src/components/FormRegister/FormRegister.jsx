import React, { useCallback, useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import * as AiIcon from 'react-icons/ai';
import * as BiIcon from 'react-icons/bi';
import * as MdIcon from 'react-icons/md';
import { useLanguage } from '../../context/LanguageLayer';
import loadingSvg from '../../assets/images/login/loading.svg';

import api from '../../axios';

const FormRegister = ({ setCurrentForm }) => {
  const [{ language, formRegister }] = useLanguage();

  const [emailRegister, setEmailRegister] = useState('');
  const [isDirtyEmail, setIsDirtyEmail] = useState(false);
  const [isHaveErrorEmail, setIsHaveErrorEmail] = useState(false);

  const [passwordRegister, setPasswordRegister] = useState('');
  const [isDirtyPassword, setIsDirtyPassword] = useState(false);
  const [isHaveErrorPassword, setIsHaveErrorPassword] = useState(false);

  const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');
  const [isDirtyConfirmPassword, setIsDirtyConfirmPassword] = useState(false);
  const [isHaveErrorConfirmPassword, setIsHaveErrorConfirmPassword] = useState(false);

  const [codeRegister, setCodeRegister] = useState('');
  const [isConfirmRegister, setIsConfirmRegister] = useState(false);

  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDirtyEmail) {
      let isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailRegister);

      isValid ? setIsHaveErrorEmail(false) : setIsHaveErrorEmail(true);
    }
  }, [emailRegister, isDirtyEmail]);

  useEffect(() => {
    if (isDirtyPassword) {
      let isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([0-9a-zA-Z!@#$%^&*]{8,})$/.test(
        passwordRegister
      );

      isValid ? setIsHaveErrorPassword(false) : setIsHaveErrorPassword(true);
    }
  }, [passwordRegister, isDirtyPassword]);

  useEffect(() => {
    if (isDirtyConfirmPassword) {
      let isValid = passwordRegister === confirmPasswordRegister;

      isValid ? setIsHaveErrorConfirmPassword(false) : setIsHaveErrorConfirmPassword(true);
    }
  }, [confirmPasswordRegister, passwordRegister, isDirtyConfirmPassword]);

  useEffect(() => {
    isDirtyEmail &&
    !isHaveErrorEmail &&
    isDirtyPassword &&
    !isHaveErrorPassword &&
    isDirtyConfirmPassword &&
    !isHaveErrorConfirmPassword &&
    codeRegister !== '' &&
    isConfirmRegister
      ? setIsValidForm(true)
      : setIsValidForm(false);
  }, [
    isDirtyEmail,
    isHaveErrorEmail,
    isDirtyPassword,
    isHaveErrorPassword,
    isDirtyConfirmPassword,
    isHaveErrorConfirmPassword,
    codeRegister,
    isConfirmRegister,
  ]);

  const handleSubmitForm = useCallback(
    async e => {
      e.preventDefault();

      let formData = {
        email: emailRegister,
        password: passwordRegister,
        register_code: codeRegister,
      };
      setIsLoading(true);

      try {
        const response = await api.post('/register_user', formData);
        // console.log(response);
        setIsLoading(false);

        if (response.status === 1) {
          NotificationManager.success(formRegister[language].submit.success, null, 500);
          setTimeout(() => {
            setCurrentForm('login');
          }, 1000);
        } else if (response.status === 100) {
          NotificationManager.error(formRegister[language].submit.error100, null, 2000);
        } else if (response.status === 101) {
          NotificationManager.error(formRegister[language].submit.error101, null, 2000);
        } else if (response.status === 102) {
          NotificationManager.error(formRegister[language].submit.error102, null, 2000);
        } else {
          NotificationManager.error(formRegister[language].submit.error, null, 2000);
        }
      } catch (error) {
        // console.error(error);
        setIsLoading(false);
        NotificationManager.error(formRegister[language].submit.error, null, 2000);
      }
    },
    [emailRegister, passwordRegister, codeRegister, formRegister, language, setCurrentForm]
  );

  const handleGetCode = useCallback(async () => {
    let formData = {
      email: emailRegister,
    };
    setIsLoading(true);

    try {
      const response = await api.post('/create_register_code', formData);
      // console.log(response);
      setIsLoading(false);

      if (response.status === 1) {
        NotificationManager.success(formRegister[language].getCodeEvent.success, null, 2000);
      } else if (response.status === 101) {
        NotificationManager.error(formRegister[language].getCodeEvent.error101, null, 2000);
      } else if (response.status === 102) {
        NotificationManager.error(formRegister[language].getCodeEvent.error102, null, 2000);
      } else {
        NotificationManager.error(formRegister[language].getCodeEvent.error, null, 2000);
      }
    } catch (error) {
      // console.error(error);
      setIsLoading(false);
      NotificationManager.error(formRegister[language].getCodeEvent.error, null, 2000);
    }
  }, [emailRegister, formRegister, language]);

  return (
    <form className='login-form' onSubmit={handleSubmitForm}>
      <NotificationContainer />
      <p className='login-form__title'>{formRegister[language].title}</p>
      <p className='login-form__subtitle'>
        <span>{formRegister[language].subtitle1} </span>
        <span onClick={() => setCurrentForm('login')}>{formRegister[language].subtitle2}</span>
      </p>
      <div className='form-control'>
        <label htmlFor='emailRegister'>{formRegister[language].email}</label>
        <input
          autoFocus
          id='emailRegister'
          type='email'
          value={emailRegister}
          onChange={e => {
            setEmailRegister(e.target.value);
            setIsDirtyEmail(true);
          }}
        />
        {isHaveErrorEmail && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formRegister[language].errorEmail}</span>
          </p>
        )}
      </div>
      <div className='form-control' style={{ marginBottom: '60px' }}>
        <label htmlFor='passwordRegister'>{formRegister[language].password}</label>
        <input
          id='passwordRegister'
          type={isHidePassword ? 'password' : 'text'}
          value={passwordRegister}
          onChange={e => {
            setPasswordRegister(e.target.value);
            setIsDirtyPassword(true);
          }}
        />
        {isHaveErrorPassword && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formRegister[language].errorPassword}</span>
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
        <label htmlFor='confirmPasswordRegister'>{formRegister[language].confirmPassword}</label>
        <input
          id='confirmPasswordRegister'
          type={isHidePassword ? 'password' : 'text'}
          value={confirmPasswordRegister}
          onChange={e => {
            setConfirmPasswordRegister(e.target.value);
            setIsDirtyConfirmPassword(true);
          }}
        />
        {isHaveErrorConfirmPassword && (
          <p className='error'>
            <BiIcon.BiErrorAlt className='error-icon' />
            <span>{formRegister[language].errorConfirmPassword}</span>
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
          <label htmlFor='codeRegister'>{formRegister[language].codeRegister}</label>
          <input
            id='codeRegister'
            type='text'
            value={codeRegister}
            onChange={e => {
              setCodeRegister(e.target.value);
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
            {formRegister[language].getCode}
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
      <div className='form-control' type='checkbox'>
        {isConfirmRegister ? (
          <MdIcon.MdCheckBox
            className='checkbox-icon'
            onClick={() => setIsConfirmRegister(false)}
          />
        ) : (
          <MdIcon.MdCheckBoxOutlineBlank
            className='checkbox-icon'
            onClick={() => setIsConfirmRegister(true)}
          />
        )}
        <p onClick={() => setIsConfirmRegister(!isConfirmRegister)}>
          {formRegister[language].agree}&nbsp;
          <a href='https://www.google.com/' target='_blank' rel='noreferrer'>
            {formRegister[language].agree1}
          </a>
          <span> | </span>
          <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
            {formRegister[language].agree2}
          </a>
        </p>
      </div>
      <div style={{ textAlign: 'right', marginBottom: '5px' }}>
        <button className='button-submitForm' disabled={!isValidForm || isLoading}>
          {formRegister[language].register}
          <img src={loadingSvg} alt='' style={{ display: `${isLoading ? 'block' : 'none'}` }} />
        </button>
      </div>
    </form>
  );
};

export default FormRegister;
