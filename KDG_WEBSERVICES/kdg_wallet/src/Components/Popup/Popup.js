import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import '../../assets/css/popup.scss';
import { useLang } from '../../context/LanguageLayer';
import useWindowSize from '../../hooks/useWindowSize';
import CloseIcon from './CloseIcon';

const popupLanguage = {
  vi: {
    swapnow: 'Chuyển đổi ngay',
    backgroundImageURL: '/images/popup/bg1.png',
    backgroundImageURL768: '/images/popup/bg3.png',
  },
  en: {
    swapnow: 'Swap now',
    backgroundImageURL: '/images/popup/bg2.png',
    backgroundImageURL768: '/images/popup/bg4.png',
  },
};

export default function Popup() {
  const history = useHistory();
  const [{ language }] = useLang();
  const [width] = useWindowSize();

  const [isShow, setIsShow] = useState(true);

  const handleHidePopup = useCallback(() => setIsShow(false), []);

  useEffect(() => {
    const hidePopup = e => e.keyCode === 27 && isShow && setIsShow(false);
    window.addEventListener('keyup', hidePopup);
    return () => window.removeEventListener('keyup', hidePopup);
  }, [isShow]);

  return (
    <div className={`popup ${isShow ? 'show' : 'hide'}`}>
      <div className='popup__mask' onClick={handleHidePopup}></div>

      <div
        className='popup__content'
        style={{
          backgroundImage: `url(${
            width > 768
              ? popupLanguage[language].backgroundImageURL
              : popupLanguage[language].backgroundImageURL768
          })`,
        }}
      >
        <CloseIcon className='popup__closeicon' onClick={handleHidePopup} />

        <div
          className='popup__swapbutton'
          onClick={() => {
            setIsShow(false);
            history.push('/wallet');
            if (width > 768) {
              window.scrollTo(0, 600);
            } else {
              window.scrollTo(0, 689);
            }
          }}
        >
          {popupLanguage[language].swapnow}
        </div>
      </div>
    </div>
  );
}
