import { useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import { ethers } from 'ethers'
import abi from '../abis/Web3bnb.json'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum)
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
)

const CHAIN_ID = '0x4' // Rinkeby (Rinkeby = '4', Hardhat = '0x7a69')

const useEthereum = () => {
  const [account, setAccount] = useState(null)
  const [isCorrectChain, setIsCorrectChain] = useState(false)

  const isWalletConnected = async () => {
    try {
      const provider = await detectEthereumProvider()

      // Chain
      const chainId = await provider.request({ method: 'eth_chainId' })
      setIsCorrectChain(chainId === CHAIN_ID)

      // Account
      const accounts = await provider.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        console.log('useEthereum.isWalletConnected setAccount', accounts[0])
        setAccount(accounts[0])
        return true
      } else {
        console.log('No authorized account found')
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider()

      // Chain
      const chainId = await provider.request({ method: 'eth_chainId' })
      setIsCorrectChain(chainId === CHAIN_ID)

      // Account
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        alert('No account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('connect', (accounts, chain) => {
        console.log(`Ethereum 'connect':\n${accounts.join('\n')}`)
        setAccount(accounts[0])
        setIsCorrectChain(chain === CHAIN_ID)
      })

      window.ethereum.on('accountsChanged', (accounts) => {
        console.log(`Ethereum 'accountsChanged':\n${accounts.join('\n')}`)
        setAccount(accounts[0])
      })

      window.ethereum.on('chainChanged', (chain) => {
        console.log(`Ethereum 'chainChanged' setChainId:\n${chain}`)
        console.log(
          `Ethereum 'chainChanged' setIsCorrectChain:\n${chain === CHAIN_ID}`
        )
        setIsCorrectChain(chain === CHAIN_ID)
      })

      window.ethereum.on('disconnect', (accounts) => {
        console.log(`Ethereum 'disconnect':\n${accounts.join('\n')}`)
        setAccount(null)
        setIsCorrectChain(false)
      })
    }
  }

  const removeListeners = () => {
    const resetState = () => {
      setAccount(null)
      setIsCorrectChain(false)
    }
    if (window.ethereum) {
      window.ethereum.removeListener('connect', () => resetState())
      window.ethereum.removeListener('accountsChanged', () => resetState())
      window.ethereum.removeListener('chainChanged', () => resetState())
      window.ethereum.removeListener('disconnect', () => resetState())
    }
  }

  return {
    isWalletConnected,
    connectWallet,
    contract,
    account,
    isCorrectChain,
    setListeners,
    removeListeners,
  }
}

export default useEthereum
