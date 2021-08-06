import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import callAPI from '../../axios';
import { Card, Tab, TabPane } from '../../components';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';

const HomeRight = () => {
  const [Ranking, setRanking] = useState({ follows: [], views: [] });

  useMemo(() => {
    callAPI.get('/ranking').then(res => {
      setRanking(res.data);
    });
  }, []);

  const history = useHistory();
  const [{ language, home }] = useLanguage();


  return (
    <>
      <div className='main__title main__title--right ml-25 mr-25'>
        <p>{home[language].ranking}</p>
      </div>

      <div className='tabContainer__home'>
        <Tab>
          {/* <TabPane name={home[language].KDG} key='1'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(el => (
              <Card
                key={o._id}
                index={index}
                type='KDG'
                amount={o.kinglive.total_follower}
                name={o.kyc ? `${o.kyc.first_name} ${o.kyc.last_name}` : ''}
                avatar={o.kyc.avatar?.path ? STORAGE_DOMAIN + o.kyc.avatar?.path : undefined}
                avatarPos={o.kyc.avatar_pos}
                onClick={() => history.push('/profile?uid=' + o._id)}
              />
            ))}
          </TabPane> */}

          <TabPane name={home[language].followers} key='2'>
            {Ranking?.follows?.map((o, index) => (
              <Card
                key={o._id}
                index={index}
                type='followers'
                amount={o.kinglive.total_follower}
                name={o.kyc ? `${o.kyc.first_name} ${o.kyc.last_name}` : ''}
                avatar={o.kyc.avatar?.path ? STORAGE_DOMAIN + o.kyc.avatar?.path : undefined}
                avatarPos={o.kyc.avatar_pos}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push('/profile?uid=' + o._id);
                }}
              />
            ))}
          </TabPane>

          <TabPane name={home[language].views} key='3'>
            {Ranking?.views?.map((o, index) => (
              <Card
                key={o._id}
                index={index}
                type='views'
                amount={o.kinglive.total_view}
                name={o.kyc ? `${o.kyc.first_name} ${o.kyc.last_name}` : ''}
                avatar={o.kyc.avatar?.path ? STORAGE_DOMAIN + o.kyc.avatar?.path : undefined}
                avatarPos={o.kyc.avatar_pos}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push('/profile?uid=' + o._id);
                }}
              />
            ))}
          </TabPane>
        </Tab>
      </div>
    </>
  );
};

export default HomeRight;
