import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, ConnectorId, useWalletModal } from '@kinglive/uikit'
import { injected, bsc, walletconnect } from '../../connectors'

import closeSVG from '../../assets/svg/close.svg'
import copy1SVG from '../../assets/svg/copy1.svg'
import storage from 'helpers/storage'
import callAPI from '../../axios'
import { useDispatch } from 'react-redux'
import { asyncChangeUser } from 'store/actions'

const copyToClipboard = (value, e) => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = value
  input.select()
  document.execCommand('copy')
  input.remove()

  const target = e.target.closest('.addressCopy')
  target.querySelector('.noti').style.display = 'block'
  setTimeout(() => {
    target.querySelector('.noti').style.display = 'none'
  }, 1000)
}

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const dispatch = useDispatch()
  const { account, activate, deactivate } = useWeb3React()

  const shortAddress = account
    ? `${account.substring(0, 3)}...${account.substring(account.length - 3)}`
    : 'Connect'

  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (!account) {
      storage.clearToken()
      storage.clearRefresh()
      storage.clearItem('user')
      return
    }

    async function createUser() {
      try {
        await callAPI.post('/user', { address: account })
      } catch (error) {
        console.log(error)
      }
    }

    async function loginUser() {
      console.log(`Login with address: ${account}`)

      try {
        const res = await callAPI.post('/login', { address: account })

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
        console.log(error)
      }
    }

    loginUser()
  }, [account])

  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }

    if (connectorId === 'bsc') {
      return activate(bsc)
    }

    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <>
      {showPopup && (
        <div className='popupX'>
          <div className='containerX' style={{ padding: '15px 0' }}>
            <img className='closeX' src={closeSVG} alt='' onClick={() => setShowPopup(false)} />
            <div className='titleX' style={{ textAlign: 'center', fontSize: 24 }}>
              Your wallet
            </div>
            <div className='descriptionX'>
              <span
                className='addressCopy'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                  position: 'relative',
                }}
                onClick={(e) => copyToClipboard(account, e)}
              >
                {account}
                <img className='pl-10' src={copy1SVG} alt='' />
                <div
                  className='noti'
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '5px 20px',
                    backgroundColor: '#000',
                    color: '#fff',
                    display: 'none',
                  }}
                >
                  Copied!
                </div>
              </span>

              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#f52871',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() =>
                  window.open(
                    'https://bscscan.com/token/0x87A2d9a9A6b2D61B2a57798f1b4b2DDd19458Fb6',
                    '_blank'
                  )
                }
              >
                View on BSCScan
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className='buttonX' onClick={() => window.location.reload()}>
                Disconnect
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        className='connect-custom'
        onClick={!account ? onPresentConnectModal : () => setShowPopup(true)}
        {...props}
      >
        {shortAddress}
      </Button>
    </>
  )
}

export default UnlockButton
