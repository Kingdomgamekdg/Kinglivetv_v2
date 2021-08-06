import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../assets/css/staking.scss';
import block1Icon from '../../assets/img/stake/block1-icon.png';
import callAPI from '../../axios';
import { STORAGE_DOMAIN } from '../../constant';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading } from '../../store/action';

const handleBlock1Loaded = function () {
  var listBlock1 = document.querySelectorAll('.item-block1');
  var heightest = listBlock1[0].offsetHeight;
  listBlock1.forEach(el => {
    if (el.offsetHeight > heightest) heightest = el.offsetHeight;
  }, []);
  listBlock1.forEach(el => (el.style.height = heightest + 'px'));
};

export default function StakingHome() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [Info, setInfo] = useState({});
  const balances = useSelector(state => state.balances);
  const [{ language, StakingHomePageLanguage }] = useLang();

  const getStakingInfo = useCallback(async () => {
    try {
      dispatch(actChangeLoading(true));
      const res = await callAPI.get('/staking_dashboard');
      dispatch(actChangeLoading(false));

      setInfo({ ...res });
    } catch (error) {
      dispatch(actChangeLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    getStakingInfo();
  }, [getStakingInfo]);

  return (
    <>
      <div className='kdg-container stake'>
        <div className='block1'>
          <div className='block-title'>
            <h2 className='title'>Kingdom Staking</h2>
            <p>{StakingHomePageLanguage[language].desc1}</p>
          </div>
          <div className='des'>{StakingHomePageLanguage[language].desc2}</div>
          <div className='kdg-row kdg-column-3 list-block1'>
            <div className='item'>
              <div onLoad={handleBlock1Loaded} className='item-block1'>
                <img src={block1Icon} alt='' />
                <p dangerouslySetInnerHTML={{ __html: StakingHomePageLanguage[language].block1 }}></p>
              </div>
            </div>
            <div className='item'>
              <div className='item-block1'>
                <img src={block1Icon} alt='' />
                <p dangerouslySetInnerHTML={{ __html: StakingHomePageLanguage[language].block2 }}></p>
              </div>
            </div>
            <div className='item'>
              <div className='item-block1'>
                <img src={block1Icon} alt='' />
                <p dangerouslySetInnerHTML={{ __html: StakingHomePageLanguage[language].block3 }}></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='stake'>
        <div className='block2'>
          <div className='kdg-container'>
            <div className='kdg-row kdg-column-3 list-block2 text-c'>
              <div className='item'>
                <div className='block2-item'>
                  <div className='outside-block'>
                    <div className='inside-block'>
                      <div className='number'>{Info.stake}</div>
                    </div>
                  </div>
                  <div className='block-name'>{StakingHomePageLanguage[language].total_stake}</div>
                </div>
              </div>
              <div className='item'>
                <div className='block2-item'>
                  <div className='outside-block'>
                    <div className='inside-block'>
                      <div className='number'>{Info.profit}</div>
                    </div>
                  </div>
                  <div className='block-name'>{StakingHomePageLanguage[language].profit}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='kdg-container stake'>
        <div className='history'>
          <table className='stacking-history'>
            <thead>
              <tr>
                <th className='head-title' colSpan='4'>
                  STAKING
                </th>
              </tr>
              <tr>
                <th>Coin/Token</th>
                <th>{StakingHomePageLanguage[language].balance}</th>
                <th>{StakingHomePageLanguage[language].operation}</th>
              </tr>
            </thead>
            <tbody>
              {balances?.map((o, i) => {
                if (o.coin.actions.includes(4)) {
                  return (
                    <tr key={i}>
                      <td>
                        <img style={{ width: 50, marginRight: 10 }} alt='' src={STORAGE_DOMAIN + o.coin.icon.path} />
                        {o.coin.code}
                      </td>
                      <td>{o.balance}</td>
                      <td>
                        <button onClick={() => history.push('/staking?coin=' + o._id)} className='enable'>
                          {StakingHomePageLanguage[language].join}
                        </button>
                        <button onClick={() => history.push('/staking/history?coin=' + o._id)} className='disable'>
                          {StakingHomePageLanguage[language].history}
                        </button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
