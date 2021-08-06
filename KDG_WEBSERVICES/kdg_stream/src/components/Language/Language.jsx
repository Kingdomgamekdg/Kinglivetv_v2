import React, { useEffect, useState } from 'react';
import * as MdIcon from 'react-icons/md';
import '../../assets/css/language.css';
import arrowDown from '../../assets/images/language/arrow-down.svg';
import { useLanguage } from '../../context/LanguageLayer';
import { CHANGE_LANGUAGE } from '../../context/reducer';
import useWindowSize from '../../hooks/useWindowSize';

const Language = () => {
  const [{ language, listLanguage }, dispatch] = useLanguage();
  const [width] = useWindowSize();
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const hidePopper = () => isShow && setIsShow(x => !x);
    window.addEventListener('click', hidePopper);
    return () => window.removeEventListener('click', hidePopper);
  }, [isShow]);

  useEffect(() => {
    const hidePopper = e => e.keyCode === 27 && isShow && setIsShow(x => !x);
    window.addEventListener('keyup', hidePopper);
    return () => window.removeEventListener('keyup', hidePopper);
  }, [isShow]);

  return (
    <div
      className='language'
      onClick={e => {
        e.stopPropagation();
        setIsShow(x => !x);
      }}
    >
      {width > 992 ? (
        <p className='language__selected'>{listLanguage[language]}</p>
      ) : (
        <MdIcon.MdLanguage className='language__languageIcon' />
      )}
      <img src={arrowDown} alt='' className={`language__arrowIcon ${isShow ? 'show' : ''}`} />

      <div className={`language__list ${isShow ? 'show' : ''}`}>
        {Object.keys(listLanguage).map(key => (
          <div
            key={key}
            className='language__item'
            onClick={() => key !== language && dispatch({ type: CHANGE_LANGUAGE, payload: key })}
          >
            {listLanguage[key]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Language;
