import { useCallback } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Web3 from 'web3'
import kdg from '../../assets/images/header/kdg.png'
import logo from '../../assets/images/header/logo.svg'
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
import { actChangeAddress, asyncChangeUser } from '../../store/actions'
import { EXPLORER_URL } from '../../constant'

export default function Header({ toggleSidebar = () => {}, IsOpenSidebar = false }) {
  const userRedux = useSelector((state) => state.user)
  const userName = useMemo(() => userRedux?userRedux?.kyc?.last_name + ' ' + userRedux?.kyc?.first_name:"", [userRedux])
  const followers = useMemo(() => userRedux?userRedux?.kinglive?.total_follower :"0", [userRedux])

  const dispatch = useDispatch()
  const history = useHistory()
  const currentAddress = useSelector((state) => state.address)

  const [IsOpenNoti, setIsOpenNoti] = useState(false)
  const [IsOpenLive, setIsOpenLive] = useState(false)
  const [IsOpenProfile, setIsOpenProfile] = useState(false)
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
    if (!window.ethereum.networkVersion==97) {
      setIsWrongNetwork(true)
    }
    window.contractKL1155 = new window.web3.eth.Contract(ABIKL1155, addressKL1155)
    window.contractMarket = new window.web3.eth.Contract(ABIMarket, addressMarket)
    window.contractERC20 = new window.web3.eth.Contract(ABIERC20, addressERC20)
    if(window.contractERC20){
      const balance = await window.contractERC20.methods.balanceOf(window.ethereum.selectedAddress).call()
      const grossBalance = new Decimal(balance).div(new Decimal(10).pow(18))
      setBalance(grossBalance.toNumber())
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    dispatch(actChangeAddress(accounts[0]))
  }, [dispatch])

  // accountsChanged
  useEffect(() => {

    const { Decimal } = require('decimal.js')
    if (!window.ethereum) return
    if (!window.ethereum.isMetaMask) return

    window.ethereum.on('accountsChanged', async function (accounts) {
      dispatch(actChangeAddress(accounts[0]))
      await loginUser()
      if(window.contractERC20){
        const balance = await window.contractERC20.methods.balanceOf(accounts[0]).call()
        const grossBalance = new Decimal(balance).div(new Decimal(10).pow(18))
        setBalance(grossBalance.toNumber())
      }
      if (accounts[0]) return
      storage.clearToken()
      storage.clearRefresh()
    })

    window.ethereum.on('networkChanged', async function (networkId) {
      console.log("networkId ",networkId)
      if(networkId == 97){
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
              <div className='titleX'>Please use Binace Smart Chain Testnet (57) to start app<applet></applet>!</div>
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
        <div className='left'>
          <div onClick={toggleSidebar} className={`toggle-menu ${IsOpenSidebar ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <a href='/' className='logo'>
            <img src={logo} alt='' />
          </a>
          <div className='search-box'>
            <svg
              width='17'
              height='17'
              viewBox='0 0 17 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='7.66667'
                cy='7.66667'
                r='6.66667'
                stroke='#C4C4C4'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16 16L12.375 12.375'
                stroke='#C4C4C4'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>

            <input type='text' className='search' placeholder='Search' />
          </div>
        </div>
        <div className='right'>
          <div onClick={() => setIsOpenNoti(!IsOpenNoti)} className='noti'>
            <span>2</span>
            <svg
              width='18'
              height='21'
              viewBox='0 0 18 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.6014 3.21623V3.58866L10.9583 3.6953C13.2008 4.36543 14.8389 6.44431 14.8389 8.89865V11.0233C14.8389 12.4191 15.2186 13.7903 15.9374 14.9876L17.323 17.2973H1.49018L2.87643 14.9866L2.87651 14.9865C3.59423 13.7894 3.974 12.4191 3.974 11.0233V8.89865C3.974 6.44431 5.61206 4.36543 7.85459 3.69529L8.21143 3.58866V3.21623V1.69499C8.21143 1.03634 8.74777 0.5 9.40642 0.5C10.0651 0.5 10.6014 1.03634 10.6014 1.69499V3.21623ZM1.42131 17.4122L1.42145 17.4119C1.4214 17.412 1.42135 17.4121 1.4213 17.4122L1.3561 17.373L1.42131 17.4122Z'
                stroke='#C4C4C4'
              />
              <path
                d='M9.407 19.8399C8.74596 19.8399 8.14589 19.5753 7.70334 19.1449H11.1107C10.6681 19.5753 10.068 19.8399 9.407 19.8399Z'
                stroke='#C4C4C4'
              />
            </svg>
            <div className={`dropdown ${IsOpenNoti ? 'show' : ''}`}>
              <p>Notification</p>
              <div className='item'>
                <span className='avatar'>
                  <img src={logo} alt='' />
                </span>
                <div className='content'>
                  <p>Bố mày đang stream nè</p>
                  <p>1s trước</p>
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => setIsOpenLive(!IsOpenLive)} className='live'>
            <svg
              width='17'
              height='13'
              viewBox='0 0 17 13'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.7216 7.45565C9.04799 8.12781 7.95625 8.12781 7.28264 7.45565C6.60924 6.78349 6.60924 5.69361 7.28264 5.02145C7.95625 4.34929 9.04799 4.34929 9.7216 5.02145C10.395 5.69361 10.395 6.78349 9.7216 7.45565Z'
                fill='#F52871'
              />
              <path
                d='M12.0776 10.0637C11.8674 10.0637 11.6573 9.98349 11.4974 9.82291C11.1775 9.50258 11.1781 8.98354 11.4984 8.66383C12.1476 8.01591 12.505 7.15458 12.505 6.23855C12.505 5.32251 12.1476 4.46118 11.4984 3.81326C11.1781 3.49334 11.1775 2.97451 11.4974 2.65397C11.8171 2.33364 12.3361 2.33302 12.6565 2.65294C13.616 3.61062 14.1444 4.88387 14.1444 6.23855C14.1444 7.59302 13.616 8.86647 12.6565 9.82416C12.4965 9.98391 12.287 10.0637 12.0776 10.0637Z'
                fill='#F52871'
              />
              <path
                d='M13.9316 12.477C13.7215 12.477 13.5114 12.3968 13.3514 12.2364C13.0315 11.9159 13.0321 11.397 13.3524 11.0771C14.6474 9.78461 15.3608 8.06629 15.3608 6.23858C15.3608 4.41086 14.6474 2.69254 13.3524 1.40002C13.0321 1.0801 13.0315 0.561274 13.3514 0.240734C13.6713 -0.079598 14.1901 -0.0802196 14.5105 0.239698C16.1159 1.84198 17.0002 3.97242 17 6.23858C17 8.50473 16.1159 10.6354 14.5105 12.2377C14.3505 12.3972 14.141 12.477 13.9316 12.477Z'
                fill='#F52871'
              />
              <path
                d='M4.92263 10.0637C4.71315 10.0637 4.50367 9.98392 4.3435 9.82417C3.38395 8.86649 2.85559 7.59303 2.85559 6.23856C2.85559 4.88388 3.38395 3.61064 4.3435 2.65295C4.66383 2.33304 5.18287 2.33345 5.50258 2.65399C5.8225 2.97432 5.82188 3.49336 5.50154 3.81328C4.85238 4.46119 4.49496 5.32253 4.49496 6.23856C4.49496 7.1546 4.85238 8.01593 5.50154 8.66385C5.82188 8.98356 5.8225 9.5026 5.50258 9.82293C5.34262 9.9833 5.13252 10.0637 4.92263 10.0637Z'
                fill='#F52871'
              />
              <path
                d='M3.06864 12.477C2.85896 12.477 2.64948 12.3972 2.48952 12.2374C0.884126 10.6352 0 8.50471 0 6.23856C0 3.97219 0.884126 1.84176 2.48952 0.239473C2.80985 -0.0802381 3.32889 -0.0798237 3.6486 0.240716C3.96852 0.561048 3.9679 1.07988 3.64756 1.3998C2.35256 2.69232 1.63917 4.41063 1.63917 6.23835C1.63917 8.06607 2.35256 9.78459 3.64756 11.0771C3.9679 11.397 3.96852 11.9159 3.6486 12.2364C3.48864 12.3968 3.27854 12.477 3.06864 12.477Z'
                fill='#F52871'
              />
            </svg>
            <span>Live</span>
            <div className={`dropdown ${IsOpenLive ? 'show' : ''}`}>
              <div onClick={() => history.push('/upload')}>
                <svg
                  width='18'
                  height='11'
                  viewBox='0 0 18 11'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16.9203 1.3133C16.7391 1.20191 16.5128 1.19174 16.3222 1.28641L12.2947 3.28901V1.83333C12.2947 0.820811 11.4692 0 10.4509 0H1.8465C0.828187 0 0.00268555 0.820811 0.00268555 1.83333V9.16667C0.00268555 10.1792 0.828187 11 1.8465 11H10.4509C11.4692 11 12.2947 10.1792 12.2947 9.16667V7.71099L16.3222 9.71667C16.6259 9.86752 16.995 9.7451 17.1468 9.44317C17.1899 9.35734 17.2121 9.2626 17.2116 9.16667V1.83333C17.2117 1.6215 17.1015 1.42474 16.9203 1.3133ZM11.0655 9.16667C11.0655 9.50419 10.7904 9.77779 10.4509 9.77779H1.8465C1.50705 9.77779 1.23188 9.50419 1.23188 9.16667V1.83333C1.23188 1.49581 1.50705 1.22221 1.8465 1.22221H10.4509C10.7904 1.22221 11.0655 1.49581 11.0655 1.83333V9.16667ZM15.9824 8.17792L12.2947 6.34459V4.65549L15.9824 2.82215V8.17792Z'
                    fill='#98999A'
                  />
                </svg>
                <span>Upload video</span>
              </div>
              <div onClick={() => history.push('/setup')}>
                <svg
                  width='18'
                  height='13'
                  viewBox='0 0 18 13'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9.8915 7.45565C9.21404 8.12781 8.11606 8.12781 7.4386 7.45565C6.76135 6.78349 6.76135 5.69361 7.4386 5.02145C8.11606 4.34929 9.21404 4.34929 9.8915 5.02145C10.5688 5.69361 10.5688 6.78349 9.8915 7.45565Z'
                    fill='#98999A'
                  />
                  <path
                    d='M12.2607 10.0637C12.0494 10.0637 11.8381 9.9835 11.6772 9.82292C11.3555 9.50258 11.3561 8.98354 11.6783 8.66383C12.3311 8.01592 12.6906 7.15458 12.6906 6.23855C12.6906 5.32251 12.3311 4.46118 11.6783 3.81326C11.3561 3.49334 11.3555 2.97451 11.6772 2.65397C11.9988 2.33364 12.5208 2.33302 12.8429 2.65294C13.808 3.61062 14.3393 4.88387 14.3393 6.23855C14.3393 7.59302 13.808 8.86648 12.8429 9.82416C12.6821 9.98391 12.4714 10.0637 12.2607 10.0637Z'
                    fill='#98999A'
                  />
                  <path
                    d='M14.1254 12.477C13.9141 12.477 13.7028 12.3968 13.542 12.2364C13.2202 11.9159 13.2208 11.397 13.543 11.0771C14.8454 9.78461 15.5629 8.06629 15.5629 6.23857C15.5629 4.41086 14.8454 2.69254 13.543 1.40002C13.2208 1.0801 13.2202 0.561274 13.542 0.240734C13.8637 -0.079598 14.3855 -0.0802196 14.7077 0.239698C16.3222 1.84198 17.2116 3.97242 17.2114 6.23857C17.2114 8.50473 16.3222 10.6354 14.7077 12.2377C14.5468 12.3972 14.3361 12.477 14.1254 12.477Z'
                    fill='#98999A'
                  />
                  <path
                    d='M5.06517 10.0637C4.8545 10.0637 4.64382 9.98393 4.48274 9.82417C3.51771 8.86649 2.98633 7.59304 2.98633 6.23856C2.98633 4.88388 3.51771 3.61064 4.48274 2.65295C4.8049 2.33304 5.32691 2.33345 5.64844 2.65399C5.97019 2.97432 5.96956 3.49336 5.6474 3.81328C4.99453 4.46119 4.63507 5.32253 4.63507 6.23856C4.63507 7.1546 4.99453 8.01593 5.6474 8.66385C5.96956 8.98356 5.97019 9.5026 5.64844 9.82293C5.48757 9.9833 5.27627 10.0637 5.06517 10.0637Z'
                    fill='#98999A'
                  />
                  <path
                    d='M3.20043 12.477C2.98955 12.477 2.77887 12.3972 2.618 12.2374C1.00344 10.6352 0.114258 8.50471 0.114258 6.23856C0.114258 3.97219 1.00344 1.84176 2.618 0.239473C2.94016 -0.0802381 3.46217 -0.0798237 3.7837 0.240716C4.10545 0.561048 4.10482 1.07988 3.78266 1.3998C2.48026 2.69232 1.76279 4.41063 1.76279 6.23835C1.76279 8.06607 2.48026 9.78459 3.78266 11.0771C4.10482 11.397 4.10545 11.9159 3.7837 12.2364C3.62283 12.3968 3.41153 12.477 3.20043 12.477Z'
                    fill='#98999A'
                  />
                </svg>

                <span>Live now</span>
              </div>
            </div>
          </div>
          <div
            onClick={() => setIsOpenConnect(true)}
            className={`connect ${currentAddress && 'disabled'}`}
          >
            {currentAddress ? shortAddress(currentAddress) : 'Connect'}
          </div>
          <div onClick={() => setIsOpenProfile(!IsOpenProfile)} className='profile'>
            <span className='avatar'>
              <img src={logo} alt='' />
            </span>
            <span className='name'>{userName}</span>
            <svg
              width='10'
              height='6'
              viewBox='0 0 10 6'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8.5631 0.139134L4.68514 4.01803L0.807178 0.138667C0.622289 -0.0462223 0.323206 -0.0462223 0.138317 0.138667C-0.0461055 0.323556 -0.0461055 0.623106 0.138317 0.807995L4.3505 5.02157C4.53492 5.20646 4.83447 5.20646 5.01889 5.02157L9.23107 0.808034C9.41549 0.623145 9.41549 0.323128 9.23107 0.138239C9.04711 -0.0457553 8.74752 -0.0457553 8.5631 0.139134Z'
                fill='#C4C4C4'
              />
            </svg>
            <div className={`dropdown ${IsOpenProfile ? 'show' : ''}`}>
              <div className='top'>
                <div className='avatar-name'>
                  <span className='avatar'>
                    <img src={logo} alt='' />
                  </span>
                  <div className='name'>
                    <span>{userName}</span>
                    <span>{followers} Followers</span>
                  </div>
                </div>
                <div className='assets'>
                    <span>{balance}</span>
                    <img src={kdg} alt='' />
                </div>
              </div>

              <div className='mid'>
                <div className='item' onClick={() => history.push('/profile')}>
                  <svg
                    width='14'
                    height='15'
                    viewBox='0 0 14 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M0 12.8572C0 10.8284 1.64469 9.18369 3.67352 9.18369H9.79604C11.8249 9.18369 13.4696 10.8284 13.4696 12.8572V14.3878C13.4696 14.726 13.1954 15.0001 12.8573 15.0001C12.5192 15.0001 12.2451 14.726 12.2451 14.3878V12.8572C12.2451 11.5046 11.1486 10.4082 9.79604 10.4082H3.67352C2.32096 10.4082 1.22451 11.5046 1.22451 12.8572V14.3878C1.22451 14.726 0.95039 15.0001 0.612253 15.0001C0.274115 15.0001 0 14.726 0 14.3878V12.8572Z'
                      fill='#C4C4C4'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M6.73504 1.22451C5.38249 1.22451 4.28603 2.32096 4.28603 3.67352C4.28603 5.02607 5.38249 6.12253 6.73504 6.12253C8.08759 6.12253 9.18405 5.02607 9.18405 3.67352C9.18405 2.32096 8.08759 1.22451 6.73504 1.22451ZM3.06152 3.67352C3.06152 1.64469 4.70621 0 6.73504 0C8.76386 0 10.4086 1.64469 10.4086 3.67352C10.4086 5.70234 8.76386 7.34703 6.73504 7.34703C4.70621 7.34703 3.06152 5.70234 3.06152 3.67352Z'
                      fill='#C4C4C4'
                    />
                  </svg>
                  <span>Profile</span>
                </div>
                <div className='item' onClick={() =>   
                  window.open(
                    EXPLORER_URL +'/address/'+window.ethereum.selectedAddress,
                    '_blank'
                  )}>

                <svg width="14" height="15" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0936 0.280837C10.0973 0.207957 10.0717 0.133849 10.016 0.0781943C9.96038 0.0225396 9.88627 -0.00312457 9.81339 0.000640937C9.80909 0.000453997 9.80484 0 9.80046 0H8.18477C8.03727 0 7.91771 0.119561 7.91771 0.267057C7.91771 0.414553 8.03727 0.534114 8.18477 0.534114H9.18241L6.54237 3.17419L5.54678 2.1786C5.49671 2.12852 5.42877 2.10038 5.35794 2.10038C5.28712 2.10038 5.21918 2.12852 5.16911 2.1786L0.368253 6.97948C0.263968 7.08377 0.263968 7.25287 0.368253 7.35718C0.42041 7.40928 0.488749 7.43535 0.557089 7.43535C0.625429 7.43535 0.693796 7.40928 0.745925 7.35713L5.35794 2.74508L6.35353 3.74067C6.45782 3.84495 6.62692 3.84495 6.73123 3.74067L9.56011 0.911813V1.81473C9.56011 1.96223 9.67967 2.08179 9.82717 2.08179C9.97467 2.08179 10.0942 1.96223 10.0942 1.81473V0.293763C10.0942 0.28941 10.0938 0.285163 10.0936 0.280837Z" fill="#C4C4C4"/>
                </svg>
                <span>Explorer</span>

                </div>
                <div className='item' onClick={() => history.push('/my-artwork')}>
                  <svg
                    width='15'
                    height='15'
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M7.5 0C6.01664 0 4.56659 0.439867 3.33323 1.26398C2.09986 2.08809 1.13856 3.25943 0.570907 4.62987C0.00324961 6.00032 -0.145275 7.50832 0.144114 8.96317C0.433503 10.418 1.14781 11.7544 2.1967 12.8033C3.2456 13.8522 4.58197 14.5665 6.03682 14.8559C7.49168 15.1453 8.99968 14.9967 10.3701 14.4291C11.7406 13.8614 12.9119 12.9001 13.736 11.6668C14.5601 10.4334 15 8.98336 15 7.5C14.9977 5.51157 14.2068 3.60523 12.8008 2.1992C11.3948 0.793167 9.48843 0.00226418 7.5 0V0ZM12.6525 12.3621L11.7 11.4096C12.6428 10.4007 13.1887 9.08473 13.237 7.70472H14.5847C14.5357 9.44206 13.8477 11.1003 12.6525 12.3621ZM1.76262 7.30793C1.74016 7.29934 1.71635 7.29481 1.69231 7.29457H0.476019C0.455299 7.29487 0.434747 7.29835 0.415081 7.30488C0.461513 5.56377 1.14973 3.90123 2.3475 2.63672L3.3 3.58922C2.35401 4.60164 1.80771 5.92306 1.76262 7.30793ZM11.41 3.30012C10.4011 2.35715 9.08515 1.81107 7.70508 1.76273V0.414961C9.44241 0.463996 11.1006 1.15194 12.3625 2.34715L11.41 3.30012ZM7.29492 1.76273C5.91491 1.81095 4.59895 2.35685 3.59004 3.29965L2.63754 2.34715C3.89934 1.1519 5.55759 0.463952 7.29492 0.414961V1.76273ZM7.5 2.16797C8.55458 2.16797 9.58547 2.48069 10.4623 3.06658C11.3392 3.65247 12.0226 4.48522 12.4262 5.45952C12.8297 6.43382 12.9353 7.50591 12.7296 8.54023C12.5238 9.57454 12.016 10.5246 11.2703 11.2703C10.5246 12.016 9.57454 12.5238 8.54023 12.7296C7.50592 12.9353 6.43382 12.8297 5.45952 12.4262C4.48522 12.0226 3.65247 11.3392 3.06658 10.4623C2.48069 9.58547 2.16797 8.55457 2.16797 7.5C2.16955 6.08634 2.73183 4.73104 3.73143 3.73143C4.73104 2.73182 6.08635 2.16955 7.5 2.16797ZM3.56156 11.7281C3.57108 11.7185 3.57964 11.7081 3.58711 11.6968C4.5964 12.6413 5.91353 13.1883 7.29492 13.2367V14.5843C5.55678 14.5354 3.8978 13.8469 2.63578 12.6507C2.64243 12.6459 2.64877 12.6407 2.65477 12.6352L3.56156 11.7281ZM7.70508 13.2367C9.08511 13.1884 10.4011 12.6425 11.41 11.6996L12.3625 12.6521C11.1006 13.8474 9.44241 14.5353 7.70508 14.5843V13.2367ZM14.5847 7.29457H13.237C13.1887 5.91456 12.6428 4.59862 11.7 3.58969L12.6525 2.63719C13.8477 3.89901 14.5357 5.55724 14.5847 7.29457ZM0.415081 7.69441C0.434747 7.70095 0.455299 7.70442 0.476019 7.70472H1.69184C1.71588 7.70448 1.73969 7.69996 1.76215 7.69137C1.80748 9.07754 2.35502 10.4 3.30281 11.4125C3.29158 11.42 3.2811 11.4286 3.27153 11.4381L2.36485 12.3449C2.35923 12.3509 2.35403 12.3573 2.34926 12.364C1.15054 11.0994 0.461657 9.43625 0.415081 7.69441Z'
                      fill='#C4C4C4'
                    />
                  </svg>
                  <span>My NFT Artwork</span>
                </div>
              </div>
          
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
