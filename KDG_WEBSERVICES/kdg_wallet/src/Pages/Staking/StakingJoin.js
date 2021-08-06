import { faArrowLeft, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import '../../assets/css/staking.scss';
import callAPI from '../../axios';
import { STORAGE_DOMAIN } from '../../constant';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading } from '../../store/action';

const style = `
  body #root{
    background-color: #f1f3f4;
  }
`;

export default function StakingJoin() {
  const [{ language, StakingJoinPageLanguage }] = useLang();
  const coin = new URLSearchParams(useLocation().search).get('coin');
  const history = useHistory();
  const dispatch = useDispatch();
  const [Packages, setPackages] = useState([]);
  const [Choose, setChoose] = useState('');
  const [Value, setValue] = useState(0);
  const balance = useSelector(state => state.balances?.find(o => o._id === coin));

  const handleGetStakingPackage = useCallback(
    async coin => {
      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.get(`/staking_package?coin=${coin}`);
        dispatch(actChangeLoading(false));

        setPackages(res.data);
        setChoose(res.data[0]);
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [dispatch]
  );

  useMemo(() => {
    handleGetStakingPackage(coin);
  }, [handleGetStakingPackage, coin]);

  const handleChangeValue = useCallback(
    e => {
      const value = Number(e.target.value);
      if (value !== 0 && !value) return setValue(0);
      if (value > balance.balance) return setValue(balance.balance);
      setValue(value);
    },
    [balance]
  );

  const profitPerDay = useMemo(() => {
    if (!Choose || !Value) return 0;
    const findPackage = Packages.find(o => o._id === Choose._id);
    return (Value * findPackage.profit_per_day) / 100;
  }, [Choose, Packages, Value]);

  const totalProfit = useMemo(() => {
    if (Choose === '' || !Value) return 0;
    const findPackage = Packages.find(o => o._id === Choose._id);
    return ((Value * findPackage.profit_per_day) / 100) * findPackage.end_after + Value;
  }, [Choose, Packages, Value]);

  const handleStaking = useCallback(async () => {
    try {
      dispatch(actChangeLoading(true));
      const res = await callAPI.post('/staking', { value: Value, coin: balance.coin._id, package: Choose._id });
      dispatch(actChangeLoading(false));

      if (res.status === 1) {
        message.success(StakingJoinPageLanguage[language].success);
      }
    } catch (error) {
      dispatch(actChangeLoading(false));
    }
  }, [dispatch, Value, balance, Choose, StakingJoinPageLanguage, language]);

  return (
    <>
      <style>{style}</style>
      <div className='kdg-container'>
        <div className='stake-join'>
          <div className='block1'>
            <div onClick={() => history.goBack()} className='back-button'>
              <span className='icon'>
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
              <span className='text'>{StakingJoinPageLanguage[language].back}</span>
            </div>
            <h2 className='title'>Staking</h2>
            <div className='block-top-info'>
              <div className='coin-info'>
                <img src={STORAGE_DOMAIN + balance?.coin.icon.path} alt='' />
                <span className='name'>{balance?.coin.code}</span>
              </div>
              <div className='stake-info'>
                {StakingJoinPageLanguage[language].profit_rate}
                <span className='percent'>{Math.ceil(Choose.profit_per_day * 360)}%</span>
              </div>
            </div>
          </div>
          <div className='block2'>
            <div className='title'>{StakingJoinPageLanguage[language].stack_package}</div>
            <p className='sub-title'>{StakingJoinPageLanguage[language].choose_stack_package}</p>

            <div className='kdg-row kdg-column-4 list-block2'>
              {Packages.map(_stake => (
                <div className='item'>
                  <div
                    onClick={() => setChoose(_stake)}
                    className={`choose-stake ${Choose._id === _stake._id ? 'active' : ''}`}
                  >
                    <span className='checkbox'>
                      <div className='icon'>
                        <FontAwesomeIcon icon={faCheck} />
                      </div>
                    </span>
                    <span className='des'>
                      {_stake.end_after - _stake.start_after} {StakingJoinPageLanguage[language].days}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className='block3'>
            <div className='kdg-row kdg-column-4'>
              <div className='item'>
                <div className='dot'></div>
                <div className='des'>
                  <div className='text'>
                    {checkLanguage({ vi: 'Thời gian bắt đầu trả lãi', en: 'Starting time' }, language)}
                  </div>
                  <div className='date'> {renderDate(calcDate(Selected).start_date)} </div>
                </div>
              </div>
              <div className='item'>
                <div className='dot'></div>
                <div className='des'>
                  <div className='text'>
                    {checkLanguage({ vi: 'Thời gian kết thúc trả lãi', en: 'Closing time' }, language)}
                  </div>
                  <div className='date'> {renderDate(calcDate(Selected).end_date)} </div>
                </div>
              </div>

              <div className='item'>
                <div className='dot'></div>
                <div className='des'>
                  <div className='text'>
                    {checkLanguage({ vi: 'Thời gian mở khóa', en: 'Unlocking time' }, language)}
                  </div>
                  <div className='date'> {renderDate(calcDate(Selected).unlock_date)} </div>
                </div>
              </div>

              <div className='item'>
                <div className='dot'></div>
                <div className='des'>
                  <div className='text'>
                    {checkLanguage({ vi: 'Thời gian xác nhận kết thúc', en: 'Confirmimg time' }, language)}
                  </div>
                  <div className='date'> {renderDate(calcDate(Selected).confirm_date)} </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className='block4'>
            <div className='title'>{StakingJoinPageLanguage[language].investment_amount}</div>
            <p className='sub-title'>{StakingJoinPageLanguage[language].enter_investment_amount}</p>
            <div className='kdg-row va-t group-input-calc'>
              <div className='kdg-col-8'>
                <div className='group-input-info'>
                  <div className='available'>
                    {StakingJoinPageLanguage[language].available_balance} {balance?.balance} {balance?.coin.code}
                  </div>
                  <div className='group-input'>
                    <span className='input'>
                      <span>{StakingJoinPageLanguage[language].enter_stake_amount}</span>
                      <input onChange={handleChangeValue} type='text' value={Value} />
                    </span>
                    <span className='coin-name'>{balance?.coin.code}</span>
                  </div>
                  <div className='kdg-row kdg-column-2'>
                    <span className='item' style={{ color: '#ff0000' }}>
                      {StakingJoinPageLanguage[language].minimum} : {Choose.min}
                    </span>
                    <span className='item' style={{ color: '#ff0000' }}>
                      {StakingJoinPageLanguage[language].maximum} : {Choose.max}
                    </span>
                  </div>
                </div>
              </div>

              <div className='kdg-col-4'>
                <div className='calc-group'>
                  <div className='top'>
                    <div className='name'>{StakingJoinPageLanguage[language].daily_interest}</div>
                    <div className='data'>
                      {profitPerDay} {balance?.coin.code}
                    </div>
                  </div>
                  <div className='bottom'>
                    <div className='name'>{StakingJoinPageLanguage[language].total_principal_and_interest}</div>
                    <div className='data'>
                      {' '}
                      {totalProfit} {balance?.coin.code}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='block5'>
            <div className='title'>
              {StakingJoinPageLanguage[language].confirm_information}{' '}
              <div className='icon'>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </div>{' '}
            </div>
            <p className='sub-title'>{StakingJoinPageLanguage[language].please_read}</p>
            <div className='block-content'>
              <div className='group-content'>
                <div className='title-content'>
                  <span className='index'>(1)</span> {StakingJoinPageLanguage[language].desc1}
                </div>
              </div>
              <div className='group-content'>
                <div className='title-content'>
                  <span className='index'>(2)</span> {StakingJoinPageLanguage[language].desc2}
                </div>
              </div>
            </div>
            <div className='input-group checkbox'>
              <input className='checkbox' type='checkbox' name='confirm' id='confirm' />
              <label className='checkbox-label' for='confirm'>
                <span className='checkbox-box'></span>
                <span dangerouslySetInnerHTML={{ __html: StakingJoinPageLanguage[language].agreement }}></span>
              </label>

              <button
                style={Value < Choose.min || Value > Choose.max ? { pointerEvents: 'none' } : null}
                onClick={handleStaking}
              >
                {StakingJoinPageLanguage[language].join_now}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
