import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputNumber } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../assets/css/wallet.scss';
import nodata from '../../assets/img/nodata.png';
import callAPI from '../../axios';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading } from '../../store/action';
import ListChart from './ListChart';
import ListCoin from './ListCoin';

const ITEM_PER_PAGE = 10;

export default function Wallet() {
  const [{ language, WalletPageLanguage }] = useLang();
  const dispatch = useDispatch();
  const [Page, setPage] = useState(1);
  const [History, setHistory] = useState([]);
  const [Total, setTotal] = useState(0);
  const user = useSelector(state => state.user);

  const handleGetHistory = useCallback(
    async page => {
      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.get(
          `/transactions?skip=${(page - 1) * ITEM_PER_PAGE}&limit=${ITEM_PER_PAGE}&type=1,2,3,4,5,6`
        );
        dispatch(actChangeLoading(false));

        setHistory(res.data);
        setTotal(res.total);
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [dispatch]
  );

  useMemo(() => {
    handleGetHistory(Page);
  }, [Page, handleGetHistory]);

  return (
    <>
      <main>
        <div className='kdg-container'>
          <section className='section-prices'>
            <h2 className='title'>{WalletPageLanguage[language].market}</h2>
            <div className='kdg-row kdg-column-4 list-price'>
              <ListChart />
            </div>
          </section>
          <section className='section-wallet'>
            <h2 className='title'>{WalletPageLanguage[language].balance_information}</h2>
            <div className='kdg-row kdg-column-2 list-coin'>
              <ListCoin />
            </div>
          </section>

          <section className='section-history'>
            <h2 className='title'>{WalletPageLanguage[language].history}</h2>
            <div className='history'>
              <table>
                <tbody>
                  <tr>
                    <th>{WalletPageLanguage[language].date}</th>
                    <th>{WalletPageLanguage[language].volume}</th>
                    <th>Token</th>
                    <th>{WalletPageLanguage[language].type}</th>
                  </tr>

                  {History && History.length > 0 ? (
                    History.map(({ create_date, type, value, coin, from }) => {
                      create_date = new Date(create_date);
                      return (
                        <tr>
                          <td className='date-time'>
                            <span className='date'>
                              {' '}
                              {create_date.getDate()} /{create_date.getMonth() + 1}/{create_date.getFullYear()}
                            </span>
                            <span className='time'>
                              {create_date.getHours()}:{create_date.getMinutes()}:{create_date.getSeconds()}
                            </span>
                          </td>
                          <td className={`quantity ${(type === 2 || type === 4  ) ? 'red' : 'green'}`}>{value}</td>
                          <td>{coin.code}</td>
                          <td>
                            {type === 1
                              ? WalletPageLanguage[language].deposit
                              : type === 2
                              ? WalletPageLanguage[language].withdrawal
                              : type === 3
                              ? WalletPageLanguage[language].swap
                              : type === 4
                              ? WalletPageLanguage[language].stake
                              : type === 5
                              ? WalletPageLanguage[language].receive_money_stake
                              : type === 6
                              ? WalletPageLanguage[language].receive_profit_stake
                              : null}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan='5'>
                        <img src={nodata} alt='' /> <br></br>
                        {WalletPageLanguage[language].nodata}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='pagination'>
              <span className='arrow' onClick={() => Page > 1 && setPage(Page - 1)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
              <InputNumber onPressEnter={e => setPage(Number(e.target.value))} value={Page} style={{ width: 60 }} />
              <span className='arrow' onClick={() => Math.ceil(Total / ITEM_PER_PAGE) > Page && setPage(Page + 1)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
