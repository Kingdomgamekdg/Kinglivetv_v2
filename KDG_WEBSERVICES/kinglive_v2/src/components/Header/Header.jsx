import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../assets/scss/header.scss'
import UnlockButton from '../../components/ConnectWalletButton'
import { useContractERC20 } from '../../components/ConnectWalletButton/contract'
import LeftHeader from './LeftHeader'
import LiveSetup from './LiveSetup'
import Noti from './Noti'
import Profile from './Profile'

export default function Header({ toggleSidebar = () => {}, IsOpenSidebar = false }) {
  const userRedux = useSelector((state) => state.user)
  const { account } = useWeb3React()
  const contractERC20 = useContractERC20()

  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (!account) return

    const { Decimal } = require('decimal.js')
    contractERC20
      .balanceOf(account)
      .then((balance) => {
        const grossBalance = new Decimal(balance._hex).div(new Decimal(10).pow(18))
        setBalance(grossBalance.toNumber())
      })
      .catch((error) => console.log(error))
  }, [account, contractERC20])

  return (
    <>
      <header>
        <LeftHeader toggleSidebar={toggleSidebar} IsOpenSidebar={IsOpenSidebar} />
        <div className='right'>
          {userRedux && (
            <>
              <Noti />
              <LiveSetup />
            </>
          )}
          <UnlockButton />
          {userRedux && <Profile balance={balance} />}
        </div>
      </header>
    </>
  )
}
