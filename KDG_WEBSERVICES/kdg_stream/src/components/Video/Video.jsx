import React from 'react';
import { Avatar, CreateDate } from '..';
import '../../assets/css/video.css';
import { STORAGE_DOMAIN } from '../../constant';
import { convertTime } from '../../helpers';

const Video = props => {
  const {
    avatar,
    title = 'Title',
    // description = 'Description',
    onClick = null,
    video,
    avataPos,
    type = 'video',
  } = props;

  const handleClick = () => onClick && onClick();

  return (
    <div className='video' onClick={handleClick}>
      <div className='video__thumb'>
        {type === 'video' && (
          <>
            <img
              onMouseOver={e => {
                var targat = e.target;
                targat.setAttribute(
                  'src',
                  `https://vz-3f44931c-ed0.b-cdn.net/${video.guid}/preview.webp`
                );
              }}
              onMouseOut={e => {
                var targat = e.target;
                targat.setAttribute(
                  'src',
                  `https://vz-3f44931c-ed0.b-cdn.net/${video.guid}/thumbnail.jpg`
                );
              }}
              src={`https://vz-3f44931c-ed0.b-cdn.net/${video.guid}/thumbnail.jpg`}
              alt=''
            />
            <span className='video__duration'>{convertTime(video.duration)}</span>
          </>
        )}

        {type === 'stream' && <img src={`${STORAGE_DOMAIN}${video.thumbnail.path}`} alt='' />}
      </div>

      <div className='video__info mt-20'>
        <div className='video__info-ava'>
          <Avatar src={avatar} position={avataPos} />
        </div>
        <div className='video__info-text'>
          <p className='video__info-text-title'>{title}</p>
          <p className='video__info-text-date'>
            <span>{video.views} views</span>
            <span> • </span>
            {type === 'video' && <CreateDate create_date={video.create_date} />}
            {type === 'stream' && <CreateDate create_date={video.last_start} />}
          </p>
          <p className='video__info-text-name'>
            {video.user.kyc.first_name} {video.user.kyc.last_name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Video;
