import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {
  Box,
  Heading,
  Container,
  Flex,
  Spacer,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react'

import Calendar from './components/Calendar'
import MintTokensDrawer from './components/MintTokensDrawer'

import { ethers } from 'ethers'
import abi from './abis/Web3bnb.json'

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum)
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
)

function App() {
  const [account, setAccount] = useState(false)
  // admin rate setting functionality
  const [isAdmin, setIsAdmin] = useState(false)

  const isConnected = async () => {
    const provider = await detectEthereumProvider()
    const accounts = await provider.request({ method: 'eth_accounts' })

    if (accounts.length > 0) {
      console.log('setAccount', accounts[0])
      setAccount(accounts[0])
    } else {
      console.log('No authorized account found')
    }
  }

  const connect = async () => {
    try {
      const provider = await detectEthereumProvider()

      // returns an arrary of accounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      // check if array at least one element
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        alert('No account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    isConnected()
  }, [])

  useEffect(() => {
    const getData = async () => {
      // get contract owner and set admin if connected account is owner
      const owner = await contract.owner()
      setIsAdmin(owner.toUpperCase() === account.toUpperCase())
      console.log('owner', owner)
    }
    getData()
  }, [account])

  return (
    <>
      <Flex
        p={{ base: 4, md: 8 }}
        minWidth="max-content"
        alignItems="center"
        gap="2"
      >
        {account && isAdmin && <MintTokensDrawer />}
        <Spacer />
        {!account && (
          <Button
            onClick={connect}
            colorScheme={'green'}
            bg={'green.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'green.500',
            }}
          >
            Connect Wallet
          </Button>
        )}
        {account && (
          <>
            <div>{account}</div>
          </>
        )}
      </Flex>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 12, md: 20 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            🏡 web3bnb <br />
            <Text as={'span'} color={'green.400'}>
              Own. Book. Enjoy!
            </Text>{' '}
            <br />
          </Heading>
          <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            {!account && <Text>Please connect to Rinkeby Network.</Text>}
            {account && <Calendar account={account} />}
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

export default App
