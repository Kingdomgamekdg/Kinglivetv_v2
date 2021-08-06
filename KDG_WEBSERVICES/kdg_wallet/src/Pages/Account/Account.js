import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/account.scss';
import Sidebar from './Sidebar';
import Tab0 from './Tab0';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Account() {
  const query = useQuery();
  const [Tab, setTab] = useState(query.get('tab') ? Number(query.get('tab')) : 0);

  useEffect(() => {
    if (window.innerWidth > 992) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const windowHeight = window.innerHeight;
      const sidebar = document.querySelector('.sidebar');
      const main = document.querySelector('.main');

      sidebar.style.height = windowHeight - headerHeight + 'px';
      main.style.height = windowHeight - headerHeight + 'px';
    }
  }, [Tab]);

  return (
    <>
      <div className='account'>
        <div className='kdg-row'>
          <Sidebar Tab={Tab} setTab={setTab} />
          <div className='kdg-col-9 va-t'>
            <div className='main'>{Tab === 0 ? <Tab0 /> : Tab === 1 ? <Tab1 /> : Tab === 2 ? <Tab2 /> : <Tab3 />}</div>
          </div>
        </div>
      </div>
    </>
  );
}
