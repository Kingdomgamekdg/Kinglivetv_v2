import { faAngleLeft, faAngleRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputNumber, message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import callAPI from '../../axios';
import { useLang } from '../../context/LanguageLayer';
import renderDate from '../../helpers/renderDate';
import { actChangeLoading } from '../../store/action';

const ITEM_PER_PAGE = 10;

const RenderStatus = function ({ id, status, language, StakingHistoryPageLanguage }) {
  const dispatch = useDispatch();

  const handleEndStaking = useCallback(
    async type => {
      try {
        dispatch(actChangeLoading(true));
        await callAPI.post('/end_staking', { type, trans_id: id });
        dispatch(actChangeLoading(false));

        type === 1 && message.success(StakingHistoryPageLanguage[language].renew_success);
        type === 2 && message.success(StakingHistoryPageLanguage[language].end_success);
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [language, id, dispatch, StakingHistoryPageLanguage]
  );

  return (
    <>
      {status === 0 ? (
        <td></td>
      ) : status === 1 ? (
        <td className='green'>{StakingHistoryPageLanguage[language].progressing}</td>
      ) : status === 4 ? (
        <td className='red'>{StakingHistoryPageLanguage[language].finished}</td>
      ) : status === 2 ? (
        <td className='red'>{StakingHistoryPageLanguage[language].waiting_for_unlock}</td>
      ) : status === 3 ? (
        <td>
          <button className='done' onClick={() => handleEndStaking(1)}>
            {StakingHistoryPageLanguage[language].renewal}
          </button>{' '}
          <br />
          <button className='cont' onClick={() => handleEndStaking(2)}>
            {StakingHistoryPageLanguage[language].finished}
          </button>
        </td>
      ) : null}
    </>
  );
};

export default function StakingHistory() {
  const coin = new URLSearchParams(useLocation().search).get('coin');
  const history = useHistory();
  const dispatch = useDispatch();
  const [Page, setPage] = useState(1);
  const [Total, setTotal] = useState(0);
  const [History, setHistory] = useState([]);
  const balance = useSelector(state => state.balances?.find(o => o._id === coin));
  const [{ language, StakingHistoryPageLanguage }] = useLang();

  const handleGetStakingHistory = useCallback(
    async (balance, Page) => {
      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.get(
          `/transactions?type=4&coin=${balance.coin._id}&skip=${(Page - 1) * ITEM_PER_PAGE}&limit=${ITEM_PER_PAGE}`
        );
        dispatch(actChangeLoading(false));

        setTotal(res.total);
        setHistory(res.data);
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [dispatch]
  );

  useMemo(() => {
    balance && handleGetStakingHistory(balance, Page);
  }, [handleGetStakingHistory, Page, balance]);

  return (
    <>
      <div className='staking-history'>
        <div className='kdg-container'>
          <div className='block1'>
            <div onClick={() => history.goBack()} className='back-button'>
              <span className='icon'>
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
              <span className='text'>{StakingHistoryPageLanguage[language].back}</span>
            </div>
          </div>

          {/* <div className='date-picker'>
            <RangePicker
              placeholder={[
                checkLanguage({ vi: 'Ngày bắt đầu', en: 'Start date' }, language),
                checkLanguage({ vi: 'Ngày kết thúc', en: 'End date' }, language),
              ]}
              // onChange={handleChangeDatePicker}
            />
          </div> */}

          <div className='history'>
            <table>
              <thead>
                <tr>
                  <th className='head-title' colSpan='9'>
                    {StakingHistoryPageLanguage[language].my_staking_record}
                  </th>
                </tr>
                <tr>
                  <th>{StakingHistoryPageLanguage[language].create_date}</th>
                  <th>{StakingHistoryPageLanguage[language].start_date}</th>
                  <th>{StakingHistoryPageLanguage[language].end_date}</th>
                  <th>{StakingHistoryPageLanguage[language].unlock_date}</th>
                  <th>{StakingHistoryPageLanguage[language].staking_quantity}</th>
                  <th>{StakingHistoryPageLanguage[language].profit_receive}</th>
                  <th>{StakingHistoryPageLanguage[language].status}</th>
                </tr>
              </thead>
              <tbody>
                {History.map(o => (
                  <tr>
                    <td>{renderDate(o.create_date, 'dd/momo/yyyy')}</td>
                    <td>{renderDate(o.create_date, 'dd/momo/yyyy', o.staking.start_after + 'd')}</td>
                    <td>{renderDate(o.create_date, 'dd/momo/yyyy', o.staking.end_after + 'd')}</td>
                    <td>{renderDate(o.create_date, 'dd/momo/yyyy', o.staking.unlock_after + 'd')}</td>
                    <td>{o.value}</td>
                    <td>{Math.floor(o.receive * 100) / 100}</td>
                    <RenderStatus
                      id={o._id}
                      language={language}
                      status={o.status}
                      StakingHistoryPageLanguage={StakingHistoryPageLanguage}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='pagination'>
              <span onClick={() => Page > 1 && setPage(Page - 1)} className='arrow'>
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
              <InputNumber onPressEnter={e => setPage(Number(e.target.value))} value={Page} style={{ width: 60 }} />
              <span onClick={() => Math.ceil(Total / ITEM_PER_PAGE) > Page && setPage(Page + 1)} className='arrow'>
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
