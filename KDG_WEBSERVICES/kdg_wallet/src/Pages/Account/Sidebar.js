import React from 'react';
import { useSelector } from 'react-redux';
import defaultAccount from '../../assets/img/default-account.png';
import inviteActive from '../../assets/img/invite-active.png';
import invite from '../../assets/img/invite.png';
import kycActive from '../../assets/img/kyc-active.png';
import kyc from '../../assets/img/kyc.png';
import userActive from '../../assets/img/user-active.png';
import user from '../../assets/img/user.png';
import verifiedActive from '../../assets/img/verified-active.png';
import verified from '../../assets/img/verified.png';
import { useLang } from '../../context/LanguageLayer';

export default function Sidebar({ Tab, setTab }) {
  const [{ language, AccountPageLanguage }] = useLang();
  const user_state = useSelector(state => state.user);
  const kyc_state = useSelector(state => state.user?.kyc);

  return (
    <div className='kdg-col-3 va-t'>
      <div className='sidebar'>
        <div className='top-sidebar'>
          <div className='avata'>
            <div className='avata-img img img-1-1'>
              <img alt='' src={defaultAccount} />
            </div>
          </div>
          <h3>
            {kyc_state?.first_name || kyc_state?.last_name
              ? `${kyc_state?.first_name} ${kyc_state?.last_name}`
              : user_state?.email}
          </h3>
        </div>
        <div className='bottom-sidebar'>
          <div className='tab'>
            <div onClick={() => setTab(0)} className={`item ${Tab === 0 ? 'active' : ''}`}>
              <img alt='' src={Tab === 0 ? userActive : user} />
              <div className='text'>
                <h4>{AccountPageLanguage[language].personal_info}</h4>
                <p>{AccountPageLanguage[language].view_and_update_info}</p>
              </div>
            </div>
            <div onClick={() => setTab(1)} className={`item ${Tab === 1 ? 'active' : ''}`}>
              <img alt='' src={Tab === 1 ? verifiedActive : verified} />
              <div className='text'>
                <h4>{AccountPageLanguage[language].security_settings}</h4>
                <p>{AccountPageLanguage[language].security_utilities}</p>
              </div>
            </div>
            <div onClick={() => setTab(2)} className={`item ${Tab === 2 ? 'active' : ''}`}>
              <img alt='' src={Tab === 2 ? inviteActive : invite} />
              <div className='text'>
                <h4>{AccountPageLanguage[language].referral}</h4>
                <p>
                  {AccountPageLanguage[language].introduce_new_member} <br />
                  {AccountPageLanguage[language].get_reward_points} <br />
                </p>
              </div>
            </div>
            <div onClick={() => setTab(3)} className={`item ${Tab === 3 ? 'active' : ''}`}>
              <img alt='' src={Tab === 3 ? kycActive : kyc} />
              <div className='text'>
                <h4>KYC</h4>
                <p>{AccountPageLanguage[language].account_verification}</p>
                <p
                  style={
                    kyc_state?.status === 1
                      ? { color: '#00ff00' }
                      : kyc_state?.status === 2
                      ? { color: '#fac800' }
                      : kyc_state?.status === 3
                      ? { color: '#ff0000' }
                      : { color: 'yellow' }
                  }
                >
                  {kyc_state?.status === 1
                    ? AccountPageLanguage[language].kyc_success
                    : kyc_state?.status === 2
                    ? AccountPageLanguage[language].kyc_pending
                    : kyc_state?.status === 3
                    ? AccountPageLanguage[language].kyc_rejected
                    : AccountPageLanguage[language].kyc_notyet}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
