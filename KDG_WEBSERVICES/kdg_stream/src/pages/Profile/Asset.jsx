import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import depositIcon from '../../assets/images/deposit.svg';
import tradeIcon from '../../assets/images/trade.svg';
import withdrawIcon from '../../assets/images/withdraw.svg';
import callAPI from '../../axios';
import { AssetBox, CreateDate, PopupBox, QR, Table } from '../../components';
import { BREAK_POINT_EXTRA_EXTRA_SMALL } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { storage } from '../../helpers';
import { useWindowSize } from '../../hooks';

export default function Asset() {
  const [{ language, profile }] = useLanguage();
  const [width] = useWindowSize();

  const GiftStorage = useSelector(state => state.giftStorage);

  const [History, setHistory] = useState([]);

  const [IsMoreHistory, setIsMoreHistory] = useState(false);
  const [HistoryActive, setHistoryActive] = useState(8);

  const balanceKDG = useSelector(state => state.balanceKDG) || 0;
  const [showPopup, setShowPopup] = useState(false);
  const MODE = { deposit: 'deposit', sell: 'sell' };
  const [mode, setMode] = useState(MODE.deposit);
  const [sellData, setSellData] = useState({});

  // const renderType = useCallback(
  //   (type, { gift: { name }, gift_user }) => {
  //     const { kyc } = gift_user || {};
  //     const { first_name, last_name } = kyc || {};
  //     if (type === 7)
  //       return profile[language].type7
  //         .replace('user_name', `${first_name ? first_name : ''} ${last_name ? last_name : ''}`)
  //         .replace('gift_name', name ? name : 'gift');
  //     if (type === 8) return profile[language].type8.replace('gift_name', name);
  //     if (type === 9)
  //       return profile[language].type9.replace(
  //         'user_name',
  //         `${first_name ? first_name : ''} ${last_name ? last_name : ''}`
  //       );
  //     if (type === 10)
  //       return profile[language].type10.replace(
  //         'user_name',
  //         `${first_name ? first_name : ''} ${last_name ? last_name : ''}`
  //       );
  //   },
  //   [language, profile]
  // );

  const handleSellGift = useCallback(
    async _sellData => {
      delete _sellData.name;

      try {
        await callAPI.post('/sell_gift', _sellData);

        setShowPopup(false);
        toast(profile[language].sell_success);
      } catch (error) {
        console.log('Error sell gift', error);
        toast(profile[language].fail);
      }
    },
    [profile, language]
  );

  const handleConfirmSellGift = useCallback(
    async e => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const submitData = {};
      for (const iterator of formData.entries()) {
        submitData[iterator[0]] = iterator[1];
      }

      if (!submitData.quantity) {
        submitData.quantity = 1;
      }

      setMode(MODE.sell);
      setSellData(submitData);
      setShowPopup(true);
    },
    [MODE.sell]
  );

  const storageHead = useMemo(() => {
    return [
      {
        key: 'gift',
        name: profile[language].gift,
        style: {
          width: '35%',
        },
        render: gift => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ width: '18%', marginRight: '5px' }} src={gift.img} alt='' />
            <span>{gift.name}</span>
          </div>
        ),
      },
      {
        key: 'quantity',
        name: profile[language].quantity,
        style: {
          width: '25%',
        },
      },
      {
        key: '_id',
        name: profile[language].action,
        style: {
          width: '40%',
        },
        render: (_id, obj) => (
          <>
            <form
              onSubmit={handleConfirmSellGift}
              style={{
                backgroundColor: '#F7F7F7',
                display: 'flex',
                height: '33px',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <input
                name='gift'
                type='text'
                style={{ display: 'none' }}
                defaultValue={obj.gift._id}
              />
              <input
                name='name'
                type='text'
                style={{ display: 'none' }}
                defaultValue={obj.gift.name}
              />
              <input
                onBlur={e => {
                  const value = Number(e.target.value);
                  if (value > obj.quantity) e.target.value = obj.quantity;
                  if (value <= 0) e.target.value = 1;
                }}
                type='number'
                name='quantity'
                placeholder={profile[language].enter_quantity}
                style={{
                  backgroundColor: '#F7F7F7',
                  flex: 1,
                  paddingLeft: '10px',
                }}
              />
              <button
                type='button'
                style={{
                  cursor: 'pointer',
                  color: '#f52871',
                  backgroundColor: '#eaeaea',
                  padding: '0 10px',
                  fontSize: '16px',
                }}
                onClick={e => {
                  e.target.previousElementSibling.value = obj.quantity;
                }}
              >
                {profile[language].all}
              </button>
              <button
                type='submit'
                style={{
                  cursor: 'pointer',
                  color: '#fff',
                  backgroundColor: '#f52871',
                  padding: '0 10px',
                  fontSize: '16px',
                }}
              >
                {profile[language].sell}
              </button>
            </form>
          </>
        ),
      },
    ];
  }, [language, profile, handleConfirmSellGift]);

  const historyHead = useMemo(() => {
    return [
      {
        key: 'create_date',
        name: profile[language].date,
        style: {
          width: '35%',
        },
        render: date => <CreateDate create_date={date} />,
      },
      {
        key: 'gift',
        name: profile[language].gift,
        style: {
          width: '25%',
        },
        render: gift => gift.name,
      },
      {
        key: 'value',
        name: profile[language].value,
        style: {
          width: '40%',
        },
        render: value => (
          <div>
            {Math.round(value * 1000) / 1000}{' '}
            <span style={{ color: '#303030', fontWeight: 500 }}>KDG</span>
          </div>
        ),
      },
    ];
  }, [language, profile]);

  const getHistory = useCallback(async () => {
    /**
     * type : 7 = mua gift , 8 = bán gifts , 9 = donate , 10 = nhận donate
     */

    const limit = 5;
    const res = await callAPI.get(
      `/transactions?type=${HistoryActive}&skip=${History.length}&limit=${limit}`
    );
    setHistory([...History, ...res.data]);

    if (res.data.length === limit) {
      setIsMoreHistory(true);
    } else {
      setIsMoreHistory(false);
    }
  }, [History, HistoryActive]);

  useEffect(() => {
    const limit = 5;

    callAPI.get(`/transactions?type=${HistoryActive}&limit=${limit}`).then(res => {
      setHistory([...res.data]);

      if (res.data.length === limit) {
        setIsMoreHistory(true);
      } else {
        setIsMoreHistory(false);
      }
    });
  }, [HistoryActive]);

  // const [isShow, setIsShow] = useState(false);
  // const [type, setType] = useState('changes');
  // const [pack, setPack] = useState(null);

  return (
    <>
      {/* {isShow && <Popper1 type={type} pack={pack} />} */}

      {showPopup && (
        <PopupBox onCancel={setShowPopup}>
          {mode === MODE.deposit && <QR onCancel={setShowPopup} />}

          {mode === MODE.sell && (
            <form
              className='form-confirm'
              onSubmit={e => {
                e.preventDefault();
                handleSellGift(sellData);
              }}
            >
              <div className='message'>
                {profile[language].are_you_sure_sell}{' '}
                <span style={{ color: '#f52871' }}>
                  {sellData.quantity} {sellData.name}
                </span>
                ?
              </div>
              <div className='action'>
                <button type='submit' className='mr-20'>
                  {profile[language].confirm}
                </button>
                <button type='button' onClick={() => setShowPopup(false)}>
                  {profile[language].cancel}
                </button>
              </div>
            </form>
          )}
        </PopupBox>
      )}

      <AssetBox title={profile[language].balance}>
        <div className='profile__balance'>
          <div className='profile__balance-balance'>
            <span>{balanceKDG}</span>
            <span>KDG</span>
          </div>

          <div className='profile__balance-action'>
            <div
              className='profile__balance-deposit'
              onClick={() => {
                setMode(MODE.deposit);
                setShowPopup(true);
              }}
            >
              <img src={depositIcon} alt='icon' />
              <span>{profile[language].deposit}</span>
            </div>

            <div
              className='profile__balance-withdraw'
              onClick={() => {
                const refresh = storage.getRefresh();
                window.open(`https://wallet.kingdomgame.org/wallet?refresh=${refresh}`, '_blank');
              }}
            >
              <img src={withdrawIcon} alt='icon' />
              <span>{profile[language].withdraw}</span>
            </div>

            <div
              className='profile__balance-trade'
              onClick={() => window.open('https://www.mxc.com/trade/easy#KDG_USDT', '_blank')}
            >
              <img src={tradeIcon} alt='icon' />
              <span>{profile[language].trade}</span>
            </div>
          </div>
        </div>
      </AssetBox>

      <AssetBox title={profile[language].storage}>
        <div
          className={`pt-20 pb-20 ${
            width > BREAK_POINT_EXTRA_EXTRA_SMALL ? 'pl-30 pr-30' : 'pl-15 pr-15'
          }`}
        >
          <div className='profile__table'>
            <Table dataHead={storageHead} dataBody={GiftStorage || []} />
          </div>
        </div>
      </AssetBox>

      <AssetBox title={profile[language].transaction_history}>
        <div
          className={`pt-20 pb-20 ${
            width > BREAK_POINT_EXTRA_EXTRA_SMALL ? 'pl-30 pr-30' : 'pl-15 pr-15'
          }`}
        >
          <div className='profile__tabs'>
            <div
              onClick={() => setHistoryActive(8)}
              className={`profile__tabs-tab ${HistoryActive === 8 ? 'active' : ''}`}
            >
              {profile[language].swap_history}
            </div>

            <div
              onClick={() => setHistoryActive(7)}
              className={`profile__tabs-tab ${HistoryActive === 7 ? 'active' : ''}`}
            >
              {profile[language].gift_history}
            </div>
          </div>

          <div className='profile__table mt-30'>
            <Table dataHead={historyHead} dataBody={History} />
          </div>

          {IsMoreHistory && (
            <div className='profile__link' onClick={getHistory}>
              {profile[language].view_more}
            </div>
          )}
        </div>
      </AssetBox>

      {/* <AssetBox title='Package Donate'>
        <div
          className={`layoutFlex layout-8`}
          style={{ '--gap-column': '60px', '--gap-row': '30px' }}
        >
          {dataPackage.map((item, i) => (
            <div
              key={i}
              className='layoutFlex-item profile__package'
              onClick={e => {
                e.stopPropagation();
                setType('changes');
                setPack(item);
                setIsShow(true);
              }}
            >
              <img src={item} alt='' className='profile__package-img' />
            </div>
          ))}

          <div
            className='layoutFlex-item profile__packageAdd'
            onClick={e => {
              e.stopPropagation();
              setType('add');
              setPack(null);
              setIsShow(true);
            }}
          >
            <HiIcon.HiPlus className='icon' />
          </div>
        </div>
      </AssetBox> */}
    </>
  );
}
