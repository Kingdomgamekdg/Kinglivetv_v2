import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message, Radio } from 'antd';
import QRCode from 'qrcode';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import deposit from '../../assets/img/deposit.png';
import stake from '../../assets/img/stake.png';
import swap from '../../assets/img/swap.png';
import withdraw from '../../assets/img/withdraw.png';
import callAPI from '../../axios';
import Form from '../../Components/Form';
import Modal from '../../Components/Modal';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading } from '../../store/action';

const listAct = [
  {
    vi: 'Nạp',
    en: 'Deposit',
    icon: deposit,
  },
  {
    vi: 'Rút',
    en: 'Withdraw',
    icon: withdraw,
  },
  {
    vi: 'Swap',
    en: 'Swap',
    icon: swap,
  },
  {
    vi: 'Stake',
    en: 'Stake',
    icon: stake,
  },
];

export default function ListCoin() {
  const [{ language, WalletPageLanguage }] = useLang();
  const history = useHistory();
  const dispatch = useDispatch();
  const [SwapTo, setSwapTo] = useState({});
  const [VisibleSwap, setVisibleSwap] = useState(false);
  const [VisibleDeposit, setVisibleDeposit] = useState(false);
  const [VisibleWithdraw, setVisibleWithdraw] = useState(false);
  const [Balance, setBalance] = useState({});
  const balances = useSelector(state => state.balances);

  const handleCopy = useCallback(
    e => {
      var input = document.createElement('input');
      document.querySelector('body').append(input);
      input.value = e.target.innerText;
      input.select();
      document.execCommand('copy');
      input.remove();
      message.success(WalletPageLanguage[language].copied);
    },
    [WalletPageLanguage, language]
  );

  const handleWithdraw = useCallback(
    async data => {
      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.post('/withdraw', data);
        dispatch(actChangeLoading(false));
        setVisibleWithdraw(false)
        if (res.status === 1) {
          message.success(WalletPageLanguage[language].withdraw_success);
        }
        if (res.status === 100) {
          message.error(WalletPageLanguage[language].withdraw_error_100);
        }
        if (res.status === 101) {
          message.error(WalletPageLanguage[language].withdraw_error_101);
        }
        if (res.status === 102) {
          message.error(WalletPageLanguage[language].withdraw_error_102);
        }
        if (res.status === 103) {
          message.error(WalletPageLanguage[language].withdraw_error_103);
        }
        if (res.status === 104) {
          message.error(WalletPageLanguage[language].withdraw_error_104);
        }
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [dispatch, WalletPageLanguage, language]
  );

  const handleSwap = useCallback(
    async data => {
      try {
        dispatch(actChangeLoading(true));
        const res = await callAPI.post('/swap', data);
        dispatch(actChangeLoading(false));
        setVisibleSwap(false)
        if (res.status === 101) {
          message.error(WalletPageLanguage[language].swap_error_101);
        }
        if (res.status === 102) {
          message.error(WalletPageLanguage[language].swap_error_102);
        }
        if (res.status === 103) {
          message.error(WalletPageLanguage[language].swap_error_103);
        }
        if (res.status === 1) {
          message.success(WalletPageLanguage[language].swap_success);
        }
      } catch (error) {
        dispatch(actChangeLoading(false));
      }
    },
    [dispatch, WalletPageLanguage, language]
  );

  const handleAct = useCallback(
    async (act, balance) => {
      if (act === 1) {
        try {
          dispatch(actChangeLoading(true));
          const qr = await QRCode.toDataURL(balance.wallet.address);
          dispatch(actChangeLoading(false));

          setBalance({ ...balance, qr });
          setVisibleDeposit(true);
        } catch (error) {
          dispatch(actChangeLoading(false));
        }
        return;
      }
      if (act === 2) {
        setBalance({ ...balance });
        setVisibleWithdraw(true);
        return;
      }
      if (act === 3) {
        setBalance({ ...balance });
        setVisibleSwap(true);
        return;
      }
      if (act === 4) {
        history.push('/staking');
      }
    },
    [dispatch, history]
  );

  return (
    <>
      <Modal isVisible={VisibleDeposit} onCancel={() => setVisibleDeposit(false)} title={listAct[0][language]}>
        <div className='model-deposit'>
          <div className='qr-code'>
            <img alt='' src={Balance.qr} /> <span></span>
          </div>
          <div className='deposit-address'>
            <span onClick={handleCopy}>{Balance.wallet?.address}</span>
            <FontAwesomeIcon icon={faCopy} />
          </div>
        </div>
      </Modal>

      <Modal isVisible={VisibleWithdraw} onCancel={() => setVisibleWithdraw(false)} title={listAct[1][language]}>
        <Form onSubmit={handleWithdraw} className='model-withdraw'>
          <div className='input-group'>
            <p>{WalletPageLanguage[language].address}</p>
            <input name='to_address' />
          </div>
          <div className='input-group'>
            <p>{WalletPageLanguage[language].amount}</p>
            <input name='value' />
          </div>
          <div className='input-group'>
            <p>{WalletPageLanguage[language].google_2FA}</p>
            <input name='token' />
          </div>
          <input style={{ display: 'none' }} name='coin' value={Balance.coin?._id} />
          <button type='submit'>{WalletPageLanguage[language].withdrawal}</button>
        </Form>
      </Modal>

      <Modal isVisible={VisibleSwap} onCancel={() => setVisibleSwap(false)} title='Swap'>
        <Form onSubmit={handleSwap} className='model-swap'>
          <input className='input-hidden' name='swapFrom' value={Balance.coin?._id} />
          <div className='input-group'>
            <p>{WalletPageLanguage[language].swap_with}</p>
            <Radio.Group value={SwapTo.coin?._id} name='swapTo' buttonStyle='solid'>
              {Balance.coin?.swap_with?.map(o => {
                const swapTo = balances.find(_balance => _balance.coin._id === o);
                return (
                  <Radio.Button onClick={() => setSwapTo(swapTo)} key={swapTo._id} value={swapTo.coin?._id}>
                    {swapTo.coin.code}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </div>
          <div className='input-group'>
            <p>{WalletPageLanguage[language].amount}</p>
            <input
              onChange={e => {
                let target = e.target;
                let value = Number(target.value);
                if (!value) {
                  value = 0;
                  target.value = value;
                }
                if (value) {
                  if (SwapTo._id) {
                    const swapToValue = (Balance.coin?.price / SwapTo.coin.price) * value;
                    target.parentElement.nextElementSibling.lastElementChild.value = swapToValue;
                  }
                }
              }}
              name='value'
              type='number'
            />
          </div>
          <div className='input-group'>
            <p>{WalletPageLanguage[language].receive}</p>
            <input disabled type='number' />
          </div>
          <button type='submit'>{WalletPageLanguage[language].swap}</button>
        </Form>
      </Modal>

      {balances?.map(balance => (
        <div key={balance._id} className='item'>
          <div className='coin'>
            <div className='top-info'>
              <div className='coin-image-name'>
                <img src={`https://storage.kingdomgame.org${balance.coin.icon.path}`} alt='coin' />
                <span className='name'> {balance.coin.code} </span>
              </div>
              <div className='balance'>
                <p>
                  <span>{WalletPageLanguage[language].available}</span>
                  <span> {balance.balance} </span>
                </p>
                <p>
                  <span>{WalletPageLanguage[language].locked}</span>
                  <span>{balance.locked}</span>
                </p>
              </div>
            </div>
            <div className='button-group'>
              <div className='kdg-row kdg-column-4 list-button text-c va-m'>
                {balance.coin.actions.map(o => (
                  <div key={o} className='item'>
                    <div onClick={() => handleAct(o, balance)} className='button'>
                      <img alt='' src={listAct[o - 1].icon} />
                      <p>{listAct[o - 1][language]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
