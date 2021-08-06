import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import '../../assets/css/home.css';
import callAPI from '../../axios';
import { Main } from '../../layout';
import HomeRight from '../Home/HomeRight';
import SearchLeft from './SearchLeft';

const Search = () => {
  const search = new URLSearchParams(useLocation().search).get('search');
  const isLoadRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  const [SearchList, setSearchList] = useState([]);

  useEffect(() => {
    document.title = `Search ${search}`;
  }, [search]);

  useMemo(() => {
    callAPI.get(`/search?s=${search}`).then(res => {
      setSearchList([...res.data]);
    });
  }, [search]);

  const getSearch = useCallback(async () => {
    const ids = SearchList.map(o => o._id);
    const res = await callAPI.get(`/search?ids=${ids}&s=${search}`);

    if (res.data.length === 0) {
      return (isLoadRef.current = false);
    }

    setSearchList([...SearchList, ...res.data]);
  }, [SearchList, search]);

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight;
      const scrolledHeight = window.scrollY + window.innerHeight;
      const restHeight = totalHeight - scrolledHeight;
      const isEnd = restHeight <= 500;

      if (isEnd && isLoadRef.current) {
        setIsLoading(true);
        await getSearch();
        setIsLoading(false);
      }
    };

    window.addEventListener('scroll', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleLoad);
    };
  }, [getSearch]);

  return (
    <Main
      className='search'
      left={<SearchLeft SearchList={SearchList} isLoading={isLoading} />}
      right={<HomeRight />}
    />
  );
};

export default Search;
