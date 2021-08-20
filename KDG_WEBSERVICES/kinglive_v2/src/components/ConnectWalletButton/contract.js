import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { ABIERC20, addressERC20 } from '../../contracts/ERC20'
import { ABIKL1155, addressKL1155 } from '../../contracts/KL1155'
import { ABIMarket, addressMarket } from '../../contracts/Market'

export function isAddress(value) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function useContract(address, ABI) {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, account)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, account])
}

export function useContractKL1155() {
  return useContract(addressKL1155, ABIKL1155)
}

export function useContractMarket() {
  return useContract(addressMarket, ABIMarket)
}

export function useContractERC20() {
  return useContract(addressERC20, ABIERC20)
}
