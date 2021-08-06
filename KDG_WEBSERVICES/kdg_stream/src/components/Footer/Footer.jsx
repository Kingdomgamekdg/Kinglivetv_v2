import React, { useState } from 'react';
import * as AiIcon from 'react-icons/ai';
import * as CgIcon from 'react-icons/cg';
import * as ImIcon from 'react-icons/im';
import '../../assets/css/footer.css';
import { Language } from '../../components';
import { useLanguage } from '../../context/LanguageLayer';
import { CHANGE_LANGUAGE } from '../../context/reducer';

const socialList = [
  {
    href: 'https://www.youtube.com/',
    icon: <AiIcon.AiFillYoutube />,
    name: 'Youtube',
  },
  {
    href: 'https://twitter.com/',
    icon: <AiIcon.AiOutlineTwitter />,
    name: 'Twitter',
  },
  {
    href: 'https://www.facebook.com/',
    icon: <ImIcon.ImFacebook />,
    name: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/',
    icon: <AiIcon.AiFillInstagram />,
    name: 'Instagram',
  },
];

const Footer = () => {
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [{ language, footer, listLanguage }, dispatch] = useLanguage();

  const showSidebar = () => setIsShowSidebar(true);
  const hideSidebar = () => setIsShowSidebar(false);

  return (
    <div className='footer'>
      <p className='footer__copyright'>{footer[language].copyright}</p>
      <div className='footer__social'>
        {socialList.map(social => (
          <a key={social.href} href={social.href} target='_blank' rel='noreferrer'>
            {social.icon}
          </a>
        ))}
        <Language />
      </div>

      <div className='footer__menu' onClick={showSidebar}>
        <CgIcon.CgMenuGridO size={26} className='footer__menuIcon' />
      </div>

      <div
        onClick={hideSidebar}
        className={`footer__sidebarContainer ${isShowSidebar ? 'show' : ''}`}
      >
        <div
          className={`footer__sidebar ${isShowSidebar ? 'show' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <div className='footer__sidebarClose' onClick={hideSidebar}>
            <CgIcon.CgClose size={30} />
          </div>

          <div className='footer__sidebarBody'>
            <p className='footer__sidebarTitle'>{footer[language].language}</p>
            {Object.keys(listLanguage).map(key => (
              <p
                key={key}
                className='footer__sidebarRow1'
                onClick={() => {
                  dispatch({ type: CHANGE_LANGUAGE, payload: key });
                  hideSidebar();
                }}
              >
                {listLanguage[key]}
              </p>
            ))}

            <p className='footer__sidebarTitle mt-10'>{footer[language].social}</p>
            {socialList.map(social => (
              <a
                key={social.href}
                className='footer__sidebarRow2'
                href={social.href}
                target='_blank'
                rel='noreferrer'
              >
                {social.icon} {social.name}
              </a>
            ))}
          </div>

          <p className={`footer__sidebarCopyright ${isShowSidebar ? 'show' : ''}`}>
            {footer[language].copyright}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
