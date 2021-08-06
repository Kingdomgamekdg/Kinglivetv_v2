import React, { useEffect, useState } from 'react';
import * as IoIcon from 'react-icons/io';
import * as MdIcon from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import '../../assets/css/cover.css';
import coverDefault from '../../assets/images/coverDefault.png';
import { useLanguage } from '../../context/LanguageLayer';
import { smoothscroll } from '../../helpers/';
import useNumber from '../../hooks/useNumber';

const itemCover = 3;

const Cover = () => {
  const [{ language, cover }] = useLanguage();
  const history = useHistory();
  const viewers = useNumber(11000);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let track = document.querySelector('.coverTrack');
    if (track) {
      let item = track.querySelector('.cover__item');
      if (item) {
        smoothscroll(track, track.scrollLeft, item.offsetWidth * activeIndex, 0, 0, 300);
      }
    }
  }, [activeIndex]);

  return (
    <div className='position-relative userSelect-none'>
      <div
        onClick={() => setActiveIndex(activeIndex - 1)}
        className={`coverBtn coverBtnLeft ${activeIndex > 0 ? 'show' : ''}`}
      >
        <MdIcon.MdKeyboardArrowLeft className='icon' />
      </div>
      <div
        onClick={() => setActiveIndex(activeIndex + 1)}
        className={`coverBtn coverBtnRight ${activeIndex < itemCover - 1 ? 'show' : ''}`}
      >
        <MdIcon.MdKeyboardArrowRight className='icon' />
      </div>
      <div
        className={`coverOverlay coverOverlayLeft ${activeIndex === itemCover - 1 ? 'show' : ''}`}
      ></div>
      <div
        className={`coverOverlay coverOverlayRight ${activeIndex === itemCover - 1 ? '' : 'show'}`}
      ></div>

      <div className='label-container'>
        <div className='label'>
          <p>{cover[language].live}</p>
        </div>
        <div className='label'>
          <IoIcon.IoIosEye className='icon' />
          <p>{viewers}</p>
        </div>
      </div>

      <div className='coverTrack'>
        <div className='cover' style={{ '--item': itemCover }}>
          {Array.from(new Array(3)).map((x, i) => (
            <div key={i} className='cover__item' onClick={() => history.push('/profile')}>
              <img src={coverDefault} alt='' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cover;
