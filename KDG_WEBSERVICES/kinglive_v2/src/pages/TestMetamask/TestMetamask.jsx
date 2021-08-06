import { useState } from 'react'
import Web3 from 'web3'
import '../../assets/scss/test-metamask.scss'
import { ABIERC20, addressERC20 } from '../../contracts/ERC20'
import { ABIKL1155, addressKL1155 } from '../../contracts/KL1155'
import { ABIMarket, addressMarket } from '../../contracts/Market'

export default function TestMetamask() {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const address2 = '0xC31866467f2f97dE8D96E4A77842aA657ee76D83'

  const connectMetaMask = async () => {
    setIsLoading(true)

    // inject web3
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.web3 = new Web3(window.ethereum)
    }

    // inject address and abi
    window.contractKL1155 = new window.web3.eth.Contract(ABIKL1155, addressKL1155)
    window.contractMarket = new window.web3.eth.Contract(ABIMarket, addressMarket)
    window.contractERC20 = new window.web3.eth.Contract(ABIERC20, addressERC20)

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    setAddress(account)

    setIsLoading(false)
  }

  // create(_maxSupply, _initSupply , _royaltyFee, _uri, _data)
  const createNFT = async () => {
    let result

    try {
      result = await window.contractKL1155.methods
        .create('10', '5', '1', 'Qmc13XyTfdvGjkpJcfm5JC6ds4dDH3mLV6RsDTrUomoFkS', 0x00)
        .send({ from: address })
    } catch (error) {
      console.log('error create nft', error)
    }

    console.log({ createNFTResult: result })
  }

  // safeTransferFrom(_from, _to, _id, _amount, _data)
  const donateNFT = async () => {
    let result

    try {
      result = await window.contractKL1155.methods
        .safeTransferFrom(address, address2, 1, 1, 0x00)
        .send({ from: address })
    } catch (error) {
      console.log('error donate nft', error)
    }

    console.log({ donateNFTResult: result })
  }

  // setApprovalForAll(address _operator, bool _approved)
  const approvalAllNFT = async () => {
    let result

    try {
      result = await window.contractKL1155.methods
        .setApprovalForAll(addressMarket, true)
        .send({ from: address })
    } catch (error) {
      console.log('error approve all nft', error)
    }

    console.log({ approveAllNFTResult: result })
  }

  // list(_tokenAddress, _tokenId, _quantity, _mask, _price, _paymentToken, _expiration)
  const listNFT = async () => {
    let isApprovedForAll
    let result

    try {
      isApprovedForAll = await window.contractKL1155.methods
        .isApprovedForAll(address, addressMarket)
        .call()
    } catch (error) {
      console.log('error approve all nft', error)
    }

    if (isApprovedForAll) {
      try {
        result = await window.contractMarket.methods
          .list(
            addressKL1155,
            5,
            1,
            1,
            10000,
            '0xb73b2e0c455f125bbec80f41a864a33fc67aada0',
            1000000
          )
          .send({ from: address })
      } catch (error) {
        console.log('error list nft', error)
      }
    }

    console.log({ isApprovedForAll: isApprovedForAll })
    console.log({ listNFTResult: result })
  }

  // approve(address spender, uint256 amount)
  const buyNFT = async () => {
    let result

    try {
      result = await window.contractERC20.methods
        .approve(addressMarket, 1000000000)
        .send({ from: address })
    } catch (error) {
      console.log('error buy nft', error)
    }

    console.log({ buyNFTResult: result })
  }

  return (
    <div className='test-metamask'>
      <button
        className={`buttonX ${isLoading ? 'test-metamask__loading' : ''} ${
          address ? 'test-metamask__hidden' : ''
        }`}
        disabled={isLoading}
        onClick={connectMetaMask}
      >
        Connect
      </button>

      <div className='test-metamask__address'>Address: {address}</div>

      <button className='buttonX' onClick={createNFT}>
        Create NFT
      </button>

      <button className='buttonX' onClick={donateNFT}>
        Donate NFT
      </button>

      <button className='buttonX' onClick={approvalAllNFT}>
        Approve all NFT
      </button>

      <button className='buttonX' onClick={listNFT}>
        List NFT
      </button>

      <button className='buttonX' onClick={buyNFT}>
        Buy NFT
      </button>
    </div>
  )
}
