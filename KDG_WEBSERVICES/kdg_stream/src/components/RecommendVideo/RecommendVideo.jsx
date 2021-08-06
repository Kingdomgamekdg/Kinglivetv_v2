import React from 'react';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';

const RecommendVideo = props => {
  const { type = 'watch', video, onClick } = props;

  const [{ language, recommend }] = useLanguage();

  const handleClick = () => onClick && onClick();

  return (
    <div className='recommend__video' onClick={handleClick}>
      <div className='recommend__video-thumbnail'>
        {type === 'watch' && (
          <img
            alt=''
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
            src={
              video.thumbnail
                ? STORAGE_DOMAIN + video.thumbnail.path
                : `https://vz-3f44931c-ed0.b-cdn.net/${video.guid}/thumbnail.jpg`
            }
          />
        )}

        {type === 'live' && <img src={`${STORAGE_DOMAIN}${video.thumbnail.path}`} alt='' />}
      </div>

      <div className='recommend__video-info'>
        <p className='recommend__video-info-title'>{video.name}</p>
        <p className='recommend__video-info-author'>
          {video.user?.kyc.first_name} {video.user?.kyc.last_name}
        </p>
        <div className='recommend__video-info-view'>
          {video.views} {recommend[language].views}
        </div>
      </div>
    </div>
  );
};

export default RecommendVideo;
