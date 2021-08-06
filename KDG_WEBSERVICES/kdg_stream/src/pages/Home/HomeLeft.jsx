import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Video } from '../../components';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import useWindowSize from '../../hooks/useWindowSize';

const HomeLeft = props => {
  const { recommendList, streammingsList, isLoading } = props;

  const history = useHistory();
  const [width] = useWindowSize();
  const [{ language, home }] = useLanguage();

  return (
    <>
      {streammingsList.length > 0 && (
        <div>
          <div className='main__title main__title--left'>
            <p>{home[language].watchLive}</p>
          </div>

          <div
            className={`layoutFlex ${
              width > 1080
                ? 'layout-4'
                : width > 815
                ? 'layout-3'
                : width > 520
                ? 'layout-2'
                : 'layout-1'
            }`}
            style={{ '--gap-column': '40px', '--gap-row': '40px' }}
          >
            {streammingsList.map(el => (
              <div key={el._id} className='layoutFlex-item'>
                <Video
                  video={el}
                  type='stream'
                  title={el.name}
                  description={el.description}
                  avataPos={el.user?.kyc.avatar_pos}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    history.push('/live?s=' + el._id);
                  }}
                  avatar={
                    el.user?.kyc.avatar?.path ? STORAGE_DOMAIN + el.user.kyc.avatar.path : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendList.length > 0 && (
        <div>
          <div className='main__title main__title--left'>
            <p>{home[language].recommend}</p>
          </div>

          <div
            className={`layoutFlex ${
              width > 1080
                ? 'layout-4'
                : width > 815
                ? 'layout-3'
                : width > 520
                ? 'layout-2'
                : 'layout-1'
            }`}
            style={{ '--gap-column': '40px', '--gap-row': '40px' }}
          >
            {recommendList.map(el => (
              <div key={el._id} className='layoutFlex-item'>
                <Video
                  video={el}
                  type='video'
                  title={el.name}
                  description={el.description}
                  avataPos={el.user?.kyc.avatar_pos}
                  onClick={() => {
                    history.push('/watch?v=' + el.short_id);
                    window.scrollTo(0, 0);
                  }}
                  avatar={
                    el.user?.kyc.avatar?.path ? STORAGE_DOMAIN + el.user.kyc.avatar.path : undefined
                  }
                />
              </div>
            ))}
          </div>

          {isLoading && (
            <CircularProgress
              color='inherit'
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                margin: '20px',
                color: '#e41a7f',
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default HomeLeft;
