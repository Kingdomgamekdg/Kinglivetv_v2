import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from '../../axios';
import Modal from '../../Components/Modal';
import { useLang } from '../../context/LanguageLayer';
import { validateForm } from '../../helpers';
import { actChangeLoading } from '../../store/action';
import { asyncGetUser } from '../../store/authAction';

export default function Tab1() {
  const [{ language, AccountPageLanguage }] = useLang();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [ValidForm, setValidForm] = useState({ newpass: false, renewpass: false, oldpass: false });
  const [Token, setToken] = useState('');
  const [Password, setPassword] = useState('');
  const [Visible, setVisible] = useState(false);
  const [VisibleDisable, setVisibleDisable] = useState(false);
  const [Eye, setEye] = useState({ oldpass: false, newpass: false, renewpass: false });

  const handleCopy = useCallback(
    e => {
      var input = document.createElement('input');
      document.querySelector('body').append(input);
      input.value = e.target.innerText;
      input.select();
      document.execCommand('copy');
      input.remove();
      message.success(AccountPageLanguage[language].copied);
    },
    [AccountPageLanguage, language]
  );

  const handleSubmitForm = useCallback(
    async e => {
      e.preventDefault();
      if (!ValidForm.oldpass || !ValidForm.newpass || !ValidForm.renewpass) {
        return;
      }

      const data = new FormData(e.target);
      const submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }

      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.post('/change_password', {
          old_pass: submitData.oldpass,
          new_pass: submitData.newpass,
        });
        dispatch(actChangeLoading(false));

        if (res.status === 1) {
          message.success(AccountPageLanguage[language].change_password_success);
          document.getElementById('oldpass').value = '';
          document.getElementById('newpass').value = '';
          document.getElementById('renewpass').value = '';
        }
        if (res.status === 100) {
          message.error(AccountPageLanguage[language].change_password_error_100);
        }
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [ValidForm, dispatch, AccountPageLanguage, language]
  );

  const handleAdd2FA = useCallback(async () => {
    try {
      dispatch(actChangeLoading(true));
      var res = await callAPI.post('/verify_2fa', { token: Token });
      dispatch(actChangeLoading(false));

      if (res.status === 1) {
        message.success(AccountPageLanguage[language].verify_2fa_success);
        dispatch(asyncGetUser());
        setToken('');
        setVisible(false);
      }
      if (res.status === 100) {
        message.error(AccountPageLanguage[language].verify_2fa_error_100);
      }
    } catch (error) {
      dispatch(actChangeLoading(false));
    }
  }, [Token, dispatch, AccountPageLanguage, language]);

  const handleDisable2FA = useCallback(async () => {
    try {
      dispatch(actChangeLoading(true));
      var res = await callAPI.post('/disable_2fa', { token: Token, password: Password });
      dispatch(actChangeLoading(false));

      if (res.status === 1) {
        message.success(AccountPageLanguage[language].disable_2fa_success);
        dispatch(asyncGetUser());
        setToken('');
        setVisibleDisable(false);
      }
      if (res.status === 100) {
        message.error(AccountPageLanguage[language].disable_2fa_error_100);
      }
      if (res.status === 101) {
        message.error(AccountPageLanguage[language].disable_2fa_error_101);
      }
    } catch (error) {
      dispatch(actChangeLoading(false));
    }
  }, [dispatch, Token, Password, AccountPageLanguage, language]);

  return (
    <>
      <Modal isVisible={Visible} title={AccountPageLanguage[language].setting_2FA} onCancel={() => setVisible(false)}>
        <div className='model-deposit'>
          <span>{AccountPageLanguage[language].scan_here}</span>
          <div className='qr-code'>
            <span></span>
            <img alt='qr' src={user?.QR_SECRET} />
          </div>
          <span>{AccountPageLanguage[language].click_to_copy}</span>
          <div onClick={handleCopy} className='deposit-address'>
            <span>{user.two_face_secret}</span>
            {/* <FontAwesomeIcon style={{ pointerEvents: 'none' }} icon={faCopy} /> */}
          </div>
          <div className='verify'>
            <input
              value={Token}
              onChange={e => setToken(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAdd2FA()}
              placeholder={AccountPageLanguage[language].code_2FA}
            />
            <button onClick={handleAdd2FA} className='button-gradiant'>
              {AccountPageLanguage[language].confirm_2FA}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isVisible={VisibleDisable}
        title={AccountPageLanguage[language].disable_2FA}
        onCancel={() => setVisibleDisable(false)}
      >
        <div className='model-deposit'>
          <div className='verify disable-2fa'>
            <input
              value={Token}
              onChange={e => setToken(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleDisable2FA()}
              placeholder={AccountPageLanguage[language].code_2FA}
            />
            <input
              value={Password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleDisable2FA()}
              placeholder={AccountPageLanguage[language].enter_password}
            />
            <button onClick={handleDisable2FA} className='button-gradiant'>
              {AccountPageLanguage[language].confirm_disable_2FA}
            </button>
          </div>
        </div>
      </Modal>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ textTransform: 'uppercase', marginBottom: '20px' }}>
          {AccountPageLanguage[language].setting_2FA}
        </h3>
        <button onClick={() => (user.is2FA ? setVisibleDisable(true) : setVisible(true))} className='button-gradiant'>
          {user.is2FA ? AccountPageLanguage[language].disable_2FA : AccountPageLanguage[language].setting_2FA}
        </button>
      </div>

      <h3>{AccountPageLanguage[language].change_password}</h3>
      <form onSubmit={handleSubmitForm}>
        <div className='input-group'>
          <span>{AccountPageLanguage[language].old_password}</span>
          <div className='input-password'>
            <FontAwesomeIcon
              onClick={() => setEye({ ...Eye, oldpass: !Eye.oldpass })}
              size='1x'
              color='#fff'
              className='eye'
              icon={Eye.oldpass ? faEye : faEyeSlash}
            />
            <input
              id='oldpass'
              name='oldpass'
              type={Eye.oldpass ? 'text' : 'password'}
              placeholder={AccountPageLanguage[language].enter_old_password}
              onChange={e => {
                if (!e.target.value.match(validateForm.password)) {
                  e.target.nextElementSibling.classList.add('show');
                  e.target.nextElementSibling.innerText = AccountPageLanguage[language].error_password;
                  setValidForm({ ...ValidForm, oldpass: false });
                } else {
                  e.target.nextElementSibling.classList.remove('show');
                  e.target.nextElementSibling.innerText = '';
                  setValidForm({ ...ValidForm, oldpass: true });
                }
              }}
            />
            <span className='validate-error'></span>
          </div>
        </div>
        <div className='input-group'>
          <span>{AccountPageLanguage[language].new_password}</span>
          <div className='input-password'>
            <FontAwesomeIcon
              onClick={() => setEye({ ...Eye, newpass: !Eye.newpass })}
              size='1x'
              color='#fff'
              className='eye'
              icon={Eye.newpass ? faEye : faEyeSlash}
            />
            <input
              id='newpass'
              name='newpass'
              type={Eye.newpass ? 'text' : 'password'}
              placeholder={AccountPageLanguage[language].enter_new_password}
              onChange={e => {
                let renewpass = document.getElementById('renewpass');
                if (!e.target.value.match(validateForm.password)) {
                  e.target.nextElementSibling.classList.add('show');
                  e.target.nextElementSibling.innerText = AccountPageLanguage[language].error_password;
                  setValidForm({ ...ValidForm, newpass: false });
                } else if (renewpass.value !== e.target.value) {
                  e.target.nextElementSibling.classList.remove('show');
                  e.target.nextElementSibling.innerText = '';
                  renewpass.nextElementSibling.classList.add('show');
                  renewpass.nextElementSibling.innerText = AccountPageLanguage[language].password_not_match;
                  setValidForm({ ...ValidForm, newpass: true, renewpass: false });
                } else {
                  renewpass.nextElementSibling.classList.remove('show');
                  renewpass.nextElementSibling.innerText = '';
                  setValidForm({ ...ValidForm, renewpass: true });
                }
              }}
            />
            <span className='validate-error'></span>
          </div>
        </div>
        <div className='input-group'>
          <span>{AccountPageLanguage[language].confirm_new_password}</span>
          <div className='input-password'>
            <FontAwesomeIcon
              onClick={() => setEye({ ...Eye, renewpass: !Eye.renewpass })}
              size='1x'
              color='#fff'
              className='eye'
              icon={Eye.renewpass ? faEye : faEyeSlash}
            />
            <input
              id='renewpass'
              name='renewpass'
              type={Eye.renewpass ? 'text' : 'password'}
              placeholder={AccountPageLanguage[language].confirm_new_password}
              onChange={e => {
                let newpass = document.getElementById('newpass');
                if (e.target.value !== newpass.value) {
                  e.target.nextElementSibling.classList.add('show');
                  e.target.nextElementSibling.innerText = AccountPageLanguage[language].password_not_match;
                  setValidForm({ ...ValidForm, renewpass: false });
                } else {
                  e.target.nextElementSibling.classList.remove('show');
                  e.target.nextElementSibling.innerText = '';
                  setValidForm({ ...ValidForm, renewpass: true });
                }
              }}
            />
            <span className='validate-error'></span>
          </div>
        </div>
        <div className='input-group'>
          <button className={ValidForm.oldpass && ValidForm.newpass && ValidForm.renewpass ? 'valid' : 'not-valid'}>
            {AccountPageLanguage[language].update}
          </button>
          <span className='not-allowed'></span>
        </div>
      </form>
    </>
  );
}
