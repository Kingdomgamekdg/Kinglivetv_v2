import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../assets/scss/header.scss'
import callAPI from '../../axios'
import storage from '../../helpers/storage'
import {  asyncChangeUser,  } from '../../store/actions'
import { useWeb3React } from '@web3-react/core'
import { useContractERC20 } from '../../components/ConnectWalletButton/contract'
import Profile from './Profile'
import Noti from './Noti'
import LeftHeader from './LeftHeader'
import LiveSetup from './LiveSetup'
import UnlockButton from '../../components/ConnectWalletButton'

export default function Header({ toggleSidebar = () => {}, IsOpenSidebar = false }) {
  const userRedux = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // Hooks em viết sẵn lấy contracts ra xài thui nè
  const { account } = useWeb3React()
  const contractERC20 = useContractERC20()
  // Hooks em viết sẵn lấy contracts ra xài thui nè

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
  }, [account,contractERC20])




  return (
    <>
      <header>
        <LeftHeader toggleSidebar={toggleSidebar} IsOpenSidebar={IsOpenSidebar} />
        <div className='right'>
          {
            userRedux && <>
              <Noti />
              <LiveSetup />
              
            </>
          }
          <UnlockButton/>
          {userRedux && <Profile balance={balance}/> }
        </div>
      </header>
    </>
  )
}
