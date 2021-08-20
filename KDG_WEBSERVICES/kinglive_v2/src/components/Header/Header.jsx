import { useCallback } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Web3 from 'web3'
import metamask from '../../assets/images/header/metamask.png'
import trust from '../../assets/images/header/trust.png'
import '../../assets/scss/header.scss'
import closeSVG from '../../assets/svg/close.svg'
import errorSVG from '../../assets/svg/error.svg'
import callAPI from '../../axios'
import { ABIERC20, addressERC20 } from '../../contracts/ERC20'
import { ABIKL1155, addressKL1155 } from '../../contracts/KL1155'
import { ABIMarket, addressMarket } from '../../contracts/Market'
import shortAddress from '../../helpers/shortAddress'
import storage from '../../helpers/storage'
import { actChangeAddress, actChangeUnreadNoti, actChangeUser, asyncChangeUser, asyncGetNoti } from '../../store/actions'
import Profile from './Profile'
import Noti from './Noti'
import LeftHeader from './LeftHeader'
import LiveSetup from './LiveSetup'

export default function Header({ toggleSidebar = () => {}, IsOpenSidebar = false }) {
  const userRedux = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const currentAddress = useSelector((state) => state.address)

  const [IsOpenConnect, setIsOpenConnect] = useState(false)
  const [insMetaMask, setInsMetaMask] = useState(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
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

  const setupMetaMask = useCallback(async () => {
    const { Decimal } = require('decimal.js')
    if (!window.ethereum) return
    if (!window.ethereum.isMetaMask) return

    window.web3 = new Web3(window.ethereum)
    // if (window.ethereum.networkVersion && window.ethereum.networkVersion !== 97) {
    //   setIsWrongNetwork(true)
    // } else {
    //   setIsWrongNetwork(false)
    // }
    window.contractKL1155 = new window.web3.eth.Contract(ABIKL1155, addressKL1155)
    window.contractMarket = new window.web3.eth.Contract(ABIMarket, addressMarket)
    window.contractERC20 = new window.web3.eth.Contract(ABIERC20, addressERC20)
    if (window.ethereum.selectedAddress && window.contractERC20) {
      const balance = await window.contractERC20.methods
        .balanceOf(window.ethereum.selectedAddress)
        .call()
      const grossBalance = new Decimal(balance).div(new Decimal(10).pow(18))
      setBalance(grossBalance.toNumber())
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    dispatch(actChangeAddress(accounts[0]))
  }, [dispatch])

  useEffect(() => {
    const { Decimal } = require('decimal.js')
    if (!window.ethereum) return
    if (!window.ethereum.isMetaMask) return

    window.ethereum.on('accountsChanged', async function (accounts) {
      dispatch(actChangeAddress(accounts[0]))
      await loginUser()
      if (window.ethereum && window.contractERC20) {
        const balance = await window.contractERC20.methods.balanceOf(accounts[0]).call()
        const grossBalance = new Decimal(balance).div(new Decimal(10).pow(18))
        setBalance(grossBalance.toNumber())
      }
      if (accounts[0]) return
      storage.clearToken()
      storage.clearRefresh()
    })

    window.ethereum.on('networkChanged', async function (networkId) {
      console.log('networkId ', networkId)
      if (networkId === 97) {
        setIsWrongNetwork(false)
      } else {
        setIsWrongNetwork(true)
      }
    })
  }, [dispatch, loginUser])

  useEffect(() => {
    async function xxx() {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await setupMetaMask()
        await loginUser()
      }
    }
    xxx()
  }, [setupMetaMask, loginUser])

  const connectMetaMask = useCallback(async () => {
    setIsOpenConnect(false)

    if (window.ethereum && window.ethereum.isMetaMask) {
      await setupMetaMask()
      await loginUser()
      return
    }

    setInsMetaMask(true)
  }, [setupMetaMask, loginUser])

  return (
    <>
      {isWrongNetwork && (
        <div className='popupX'>
          <div className='containerX'>
            <div className='titleX'>
              Please use Binance Smart Chain Testnet (97) to start app<applet></applet>!
            </div>
          </div>
        </div>
      )}

      {insMetaMask && (
        <div className='popupX'>
          <div className='containerX'>
            <img className='closeX' src={closeSVG} alt='' onClick={() => setInsMetaMask(false)} />
            <div className='titleX'>You haven't installed MetaMask yet!</div>
            <div className='descriptionX'>
              <img src={errorSVG} alt='' />
              <span>Do you want to install MetaMask?</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                className='buttonX mr-20'
                onClick={() => {
                  window.open(
                    'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                    '_blank'
                  )
                  setInsMetaMask(false)
                }}
              >
                Yes
              </div>
              <div className='buttonX buttonX--cancel' onClick={() => setInsMetaMask(false)}>
                No
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`connect-wallet ${IsOpenConnect ? 'show' : ''}`}>
        <div onClick={() => setIsOpenConnect(false)} className='mask'></div>
        <div className='body'>
          <p>
            Connect to a wallet <span onClick={() => setIsOpenConnect(false)}></span>
          </p>
          <div className='item' onClick={connectMetaMask}>
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
