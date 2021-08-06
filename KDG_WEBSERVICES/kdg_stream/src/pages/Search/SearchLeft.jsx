import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Video } from '../../components';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import useWindowSize from '../../hooks/useWindowSize';

const SearchLeft = props => {
  const { SearchList, isLoading } = props;

  const history = useHistory();
  const [width] = useWindowSize();
  const [{ search, language }] = useLanguage();

  return (
    <>
      {SearchList.length === 0 && (
        <>
          <div className='main__title main__title--left'>
            <p>{search[language].result} 🤦‍♂️😢🤦‍♀️</p>
          </div>

          <p style={{ color: '#303030', fontSize: '24px', fontWeight: 600, marginBottom: '30px' }}>
            {search[language].not_found} 🤦‍♂️😢🤦‍♀️
          </p>
        </>
      )}

      {SearchList.length > 0 && (
        <div>
          <div className='main__title main__title--left'>
            <p>{search[language].result} 😊😜😊</p>
          </div>

          <div
            className={`pl-10 pr-10 layoutFlex ${
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
            {SearchList.map(el => (
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

SearchLeft.propTypes = {
  SearchList: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SearchLeft;
