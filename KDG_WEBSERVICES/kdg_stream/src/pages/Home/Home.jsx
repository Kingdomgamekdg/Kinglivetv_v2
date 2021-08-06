import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../assets/css/home.css';
import callAPI from '../../axios';
import { Main } from '../../layout';
import HomeLeft from './HomeLeft';
import HomeRight from './HomeRight';
import banner1 from '../../assets/images/banner/banner1.mp4';

const Home = () => {
  const isLoadMore = useRef(true);
  const isLoadingAPI = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const [recommendList, setRecommendList] = useState([]);
  const [streammingsList, setStreammingsList] = useState([]);

  useEffect(() => {
    document.title = 'Kinglive TV';
  }, []);

  useMemo(() => {
    callAPI.get('/recommend').then(res => {
      setRecommendList([...res.data]);
    });

    callAPI.get('/streammings').then(res => {
      setStreammingsList(res.data);
    });
  }, []);

  const getRecommend = useCallback(async () => {
    const ids = recommendList.map(o => o._id);
    const res = await callAPI.get(`/recommend?ids=${ids}`);

    if (res.data.length === 0) {
      isLoadMore.current = false;
      setRecommendList([...recommendList, ...res.data]);
      return;
    }

    setRecommendList([...recommendList, ...res.data]);
  }, [recommendList]);

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight;
      const scrolledHeight = window.scrollY + window.innerHeight;
      const restHeight = totalHeight - scrolledHeight;
      const isEnd = restHeight <= 500;

      if (isEnd && isLoadMore.current && !isLoadingAPI.current) {
        isLoadingAPI.current = true;
        setIsLoading(true);
        await getRecommend();
        setIsLoading(false);
        isLoadingAPI.current = false;
      }
    };

    window.addEventListener('scroll', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleLoad);
    };
  }, [getRecommend]);

  return (
    <>
      <div className='banner'>
        <video loop muted autoPlay src={banner1}></video>
      </div>

      <Main
        className='home'
        left={
          <HomeLeft
            recommendList={recommendList}
            streammingsList={streammingsList}
            isLoading={isLoading}
          />
        }
        right={<HomeRight />}
      />
    </>
  );
};

export default Home;
