import React from 'react';
import { Avatar } from '..';
import '../../assets/css/video.css';
import { STORAGE_DOMAIN } from '../../constant';

const Stream = props => {
  const {
    avatar,
    title = 'Title',
    description = 'Description',
    onClick = null,
    video,
    avataPos,
  } = props;

  const handleClick = () => onClick && onClick();

  return (
    <div className='video' onClick={handleClick}>
      <div className='video__thumb'>
        <img src={`${STORAGE_DOMAIN}${video.thumbnail.path}`} alt='' />
      </div>

      <div className='video__info mt-20'>
        <div className='video__info-ava'>
          <Avatar src={avatar} position={avataPos} />
        </div>

        <div className='video__info-text'>
          <p className='video__info-text-title'>{title}</p>
          <p className='video__info-text-desc'>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Stream;
