import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import metamask from '../../assets/images/header/metamask.png'
import trust from '../../assets/images/header/trust.png'
import '../../assets/scss/header.scss'
import callAPI from '../../axios'
import shortAddress from '../../helpers/shortAddress'
import storage from '../../helpers/storage'
import {  asyncChangeUser, asyncGetNoti } from '../../store/actions'
import { useWeb3React } from '@web3-react/core'
import { useContractKL1155, useContractERC20 } from '../../components/ConnectWalletButton/contract'
import {  asyncChangeUser } from '../../store/actions'
import Profile from './Profile'
import Noti from './Noti'
import LeftHeader from './LeftHeader'
import LiveSetup from './LiveSetup'

export default function Header({ toggleSidebar = () => {}, IsOpenSidebar = false }) {
  const userRedux = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // Hooks em viết sẵn lấy contracts ra xài thui nè
  const { account } = useWeb3React()
  const contractKL1155 = useContractKL1155()
  const contractERC20 = useContractERC20()
  // Hooks em viết sẵn lấy contracts ra xài thui nè

  const history = useHistory()


  const [IsOpenConnect, setIsOpenConnect] = useState(false)
  const [balance, setBalance] = useState(0)

  const createUser = useCallback(async () => {
    if (!window.ethereum.selectedAddress) return

    try {
      await callAPI.post('/user', { address: window.ethereum.selectedAddress })
    } catch (error) {
      console.log('error create')
      console.log(error)
    }
  }, [])

  const loginUser = useCallback(async () => {
    if (!window.ethereum.selectedAddress) return

    try {
      const res = await callAPI.post('/login', { address: window.ethereum.selectedAddress })

      if (res.status === 1) {
        storage.setToken(res.jwt)
        storage.setRefresh(res.refreshToken)
        dispatch(asyncChangeUser())
      }

      if (res.status === 100) {
        await createUser()
        await loginUser()
      }
    } catch (error) {
      console.log('error login')
      console.log(error)
    }
  }, [createUser, dispatch])



  // accountsChanged

  useEffect(() => {
    if (!account) return

    const { Decimal } = require('decimal.js')
    // chỗ này thay cho .call() nè
    // Ở dưới có 1 chỗ thay cho .send({ from: address })
    contractERC20
      .balanceOf(account)
      .then((balance) => {
        const grossBalance = new Decimal(balance._hex).div(new Decimal(10).pow(18))
        setBalance(grossBalance.toNumber())
      })
      .catch((error) => console.log(error))
  }, [account])

  const handleOpenNoti = useCallback(() => {
    console.log(123);
    setIsOpenNoti(!IsOpenNoti)
    dispatch(asyncGetNoti())
  },[IsOpenNoti])


  return (
    <>



      <div className={`connect-wallet ${IsOpenConnect ? 'show' : ''}`}>
        <div onClick={() => setIsOpenConnect(false)} className='mask'></div>
        <div className='body'>
          <p>
            Connect to a wallet <span onClick={() => setIsOpenConnect(false)}></span>
          </p>
          <div className='item'>
            <span>Metamask</span>
            <div className='icon'>
              <img src={metamask} alt='' />
            </div>
          </div>
          <div className='item'>
            <span>TrustWallet</span>
            <div className='icon'>
              <img src={trust} alt='' />
            </div>
          </div>
          <span>
            <svg
              width='13'
              height='13'
              viewBox='0 0 13 13'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7.04152 9.75C7.04152 10.0491 6.79902 10.2916 6.49989 10.2916C6.20075 10.2916 5.95825 10.0491 5.95825 9.75C5.95825 9.45086 6.20075 9.20836 6.49989 9.20836C6.79902 9.20836 7.04152 9.45086 7.04152 9.75Z'
                fill='#F52871'
              />
              <path
                d='M6.5 13C2.91576 13 0 10.0842 0 6.5C0 2.91576 2.91576 0 6.5 0C10.0842 0 13 2.91576 13 6.5C13 10.0842 10.0842 13 6.5 13ZM6.5 0.8125C3.36376 0.8125 0.8125 3.36376 0.8125 6.5C0.8125 9.63624 3.36376 12.1875 6.5 12.1875C9.63624 12.1875 12.1875 9.63624 12.1875 6.5C12.1875 3.36376 9.63624 0.8125 6.5 0.8125Z'
                fill='#F52871'
              />
              <path
                d='M6.50011 7.98962C6.27586 7.98962 6.09386 7.80762 6.09386 7.58337V7.03628C6.09386 6.52063 6.42107 6.05854 6.90746 5.88686C7.55472 5.65884 7.98973 4.96923 7.98973 4.46875C7.98973 3.64703 7.32184 2.97914 6.50011 2.97914C5.67839 2.97914 5.0105 3.64703 5.0105 4.46875C5.0105 4.693 4.8285 4.875 4.60425 4.875C4.38 4.875 4.198 4.693 4.198 4.46875C4.198 3.19962 5.23048 2.16664 6.50011 2.16664C7.76974 2.16664 8.80223 3.19962 8.80223 4.46875C8.80223 5.3723 8.08881 6.33159 7.17773 6.65334C7.01527 6.71017 6.90636 6.8645 6.90636 7.03678V7.58337C6.90636 7.80762 6.72437 7.98962 6.50011 7.98962Z'
                fill='#F52871'
              />
            </svg>
            Learn how to connect
          </span>
        </div>
      </div>
      <header>
        <LeftHeader toggleSidebar={toggleSidebar} IsOpenSidebar={IsOpenSidebar} />
        <div className='right'>
          {
            userRedux && <>
              <Noti />
              <LiveSetup />
            </>
          }
          
          <div
            onClick={() => setIsOpenConnect(true)}
            className={`connect ${currentAddress ? 'disabled' : ''}`}
          >
            {currentAddress ? shortAddress(currentAddress) : 'Connect'}
          </div>

          {userRedux && <Profile balance={balance}/> }
        </div>
      </header>
    </>
  )
}
