import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import coverDefault from '../../assets/images/coverDefault.jpg';
import { PLAY_STREAM } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';

const SetupLeft = props => {
  const { Stream } = props;
  const [{ language, setup }] = useLanguage();
  const [IsCanPlay, setIsCanPlay] = useState(false);

  useEffect(() => {
    if (Stream.connect_status === 1) {
      setTimeout(() => {
        setIsCanPlay(true);
      }, 5000);
    } else {
      setIsCanPlay(false);
    }
  }, [Stream]);

  return (
    <>
      <div className='main__title main__title--left'>
        <p>{setup[language].preview}</p>
      </div>

      <div className='setup__video'>
        {Stream?.connect_status !== 1 || !IsCanPlay ? (
          <>
            <img src={coverDefault} alt='' />
            <div className={`setup__video-blur show`}></div>
          </>
        ) : (
          <ReactHlsPlayer
            src={`${PLAY_STREAM}${Stream.key}/index.m3u8`}
            autoPlay={true}
            controls={true}
            muted
            width='100%'
            height='auto'
          />
        )}
      </div>
    </>
  );
};

SetupLeft.propTypes = {
  Stream: PropTypes.object.isRequired,
};

export default SetupLeft;
