/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../ButtonV2'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import Spacer from '../Spacer'
import { ReactComponent as MetamaskIcon } from '../../assets/images/wallets/metamask.svg'
import { ReactComponent as BinanceChainIcon } from '../../assets/images/wallets/binance_chain.svg'
import { ReactComponent as QuestionIcon } from '../../assets/images/wallets/question.svg'
import { ReactComponent as TrustIcon } from '../../assets/images/wallets/trust.svg'
import { ReactComponent as WalletConnectIcon } from '../../assets/images/wallets/walletconnect.svg'

import WalletCard from './components/WalletCard'
import {MAINNET_BSC_URL, MAINNET_CHAIN_ID} from "../../constants";

const WalletProviderModal = (props) => {
	const { onDismiss } = props
	const { account, connect, error } = useWallet()
	const handleLogin = () => {
		connect('injected')
	}

	const connectTrustWallet = () => {
		connect('injected')
	}

	const connectWalletConnect = () => {
		connect('walletconnect')
	}

	const connectBinance = () => {
		connect('bsc')
	}

	useEffect(() => {
		if (account) {
			onDismiss()
		}
	}, [account, onDismiss])

	useEffect(() => {
		const setupNetwork = async () => {
			// @ts-ignore
			const provider = window?.ethereum

			if (provider) {
				try {
					// @ts-ignore
					await provider?.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: `0x${MAINNET_CHAIN_ID.toString(16)}`,
								chainName: 'Binance Smart Chain Mainnet',
								nativeCurrency: {
									name: 'BNB',
									symbol: 'bnb',
									decimals: 18,
								},
								rpcUrls: [MAINNET_BSC_URL],
								blockExplorerUrls: ['https://bscscan.com/'],
							},
						],
					})
					return true
				} catch (error) {
					console.error(error)
					return false
				}
			} else {
				console.error(
					"Can't setup the BSC network on metamask because window.ethereum is undefined",
				)
				return false
			}
		}

		if (error?.name === 'ChainUnsupportedError') {
			setupNetwork()
		}
	}, [error])

	return (
		<Modal>
			{/* <ModalTitle onDismiss={onDismiss} text="Connect to a wallet" /> */}
			<ModalContent>
				<StyledWalletsWrapper>
					<WalletCard
						icon={<MetamaskIcon />}
						onConnect={handleLogin}
						title="Metamask"
					/>
					<WalletCard
						icon={<BinanceChainIcon />}
						onConnect={connectBinance}
						title="Binance Chain Wallet"
					/>
					<WalletCard
						icon={<WalletConnectIcon />}
						onConnect={connectWalletConnect}
						title="WalletConnect"
					/>
					<WalletCard
						icon={<TrustIcon />}
						onConnect={connectTrustWallet}
						title="TrustWallet"
					/>
					<Spacer size="sm" />
				</StyledWalletsWrapper>
			</ModalContent>
			<ModalActions>
				<a rel="noopener noreferrer" href='/' target='_blank'>
					<QuestionIcon />
					<span>Learn how to connect</span>
				</a>
			</ModalActions>
		</Modal>
	)
}

const StyledWalletsWrapper = styled.div`
	display: flex;
	flex-direction: column;
`

export default WalletProviderModal
