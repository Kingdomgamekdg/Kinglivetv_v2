import { CircularProgress } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as MdIcon from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { RecommendVideo } from '..';
import '../../assets/css/recommend.css';
import callAPI from '../../axios';
import { BREAK_POINT_MEDIUM } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import useWindowSize from '../../hooks/useWindowSize';

const Recommend = ({ id }) => {
  const history = useHistory();

  const [width] = useWindowSize();
  const [{ recommend, language }] = useLanguage();

  const isLoadRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  const [recommendList, setRecommendList] = useState([]);
  const [streammingsList, setStreammingsList] = useState([]);

  const [showStream, setShowStream] = useState(true);
  const [showRecommend, setShowRecommend] = useState(true);

  useMemo(() => {
    callAPI.get(`/recommend_by_video?video=${id}`).then(res => {
      setRecommendList([...res.data]);
    });

    callAPI.get('/streammings').then(res => {
      setStreammingsList(res.data);
    });
  }, [id]);

  const getRecommend = useCallback(async () => {
    const ids = recommendList.map(o => o._id);
    const res = await callAPI.get(`/recommend_by_video?ids=${ids}&video=${id}`);

    if (res.data.length === 0) {
      return (isLoadRef.current = false);
    }

    setRecommendList([...recommendList, ...res.data]);
  }, [recommendList, id]);

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight;
      const scrolledHeight = window.scrollY + window.innerHeight;
      const restHeight = totalHeight - scrolledHeight;
      const isEnd = restHeight <= 500;

      if (isEnd && isLoadRef.current) {
        setIsLoading(true);
        await getRecommend();
        setIsLoading(false);
      }
    };

    window.addEventListener('scroll', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleLoad);
    };
  }, [getRecommend]);

  return (
    <>
      {streammingsList.length > 0 && (
        <div className='recommend__titleList' onClick={() => setShowStream(x => !x)}>
          <span>{recommend[language].watchlive}</span>
          <MdIcon.MdArrowDropDown className={showStream ? 'down' : 'up'} />
        </div>
      )}

      {showStream && (
        <div
          className={`layoutFlex ${
            width > BREAK_POINT_MEDIUM
              ? 'layout-1'
              : width > 1187
              ? 'layout-4'
              : width > 897
              ? 'layout-3'
              : width > 577
              ? 'layout-2'
              : 'layout-1'
          }`}
          style={{ '--gap-row': '40px', '--gap-column': '40px' }}
        >
          {streammingsList.map(el => (
            <div key={el._id} className='layoutFlex-item'>
              <RecommendVideo
                type='live'
                video={el}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push('/live?s=' + el._id);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {recommendList.length > 0 && (
        <div className='recommend__titleList' onClick={() => setShowRecommend(x => !x)}>
          <span>{recommend[language].recommend}</span>
          <MdIcon.MdArrowDropDown className={showRecommend ? 'down' : 'up'} />
        </div>
      )}

      {showRecommend && (
        <div
          className={`layoutFlex ${
            width > BREAK_POINT_MEDIUM
              ? 'layout-1'
              : width > 1187
              ? 'layout-4'
              : width > 897
              ? 'layout-3'
              : width > 577
              ? 'layout-2'
              : 'layout-1'
          }`}
          style={{ '--gap-row': '40px', '--gap-column': '40px' }}
        >
          {recommendList.map(el => (
            <div key={el._id} className='layoutFlex-item'>
              <RecommendVideo
                type='watch'
                video={el}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push('/watch?v=' + el.short_id);
                }}
              />
            </div>
          ))}
        </div>
      )}

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
    </>
  );
};

export default Recommend;
