import { useEffect, useState } from 'react'
import {
  Box,
  Center,
  Heading,
  Container,
  Flex,
  Spacer,
  Tag,
  Text,
  Button,
  Stack,
  Wrap,
} from '@chakra-ui/react'

import { ethers } from 'ethers'
import useEthereum from './hooks/useEthereum'

import PropertyInfoCard from './components/PropertyInfoCard'
import Calendar from './components/Calendar'
import MintTokensDrawer from './components/MintTokensDrawer'
import SetRateDrawer from './components/SetRateDrawer'
import WithdrawEarningsButton from './components/WithdrawEarningsButton'

// Shorten wallet address.
const shortAddress = (str) =>
  `${str.substring(0, 5)}...${str.substring(str.length - 4)}`

function App() {
  // admin rate setting functionality
  const [isAdmin, setIsAdmin] = useState(false)
  const [rate, setRate] = useState(false)
  // shareholder functionality
  const [earnings, setEarnings] = useState(false)

  const {
    isWalletConnected,
    connectWallet,
    contract,
    account,
    isCorrectChain,
    setListeners,
    removeListeners,
  } = useEthereum()

  useEffect(() => {
    setListeners()
    isWalletConnected()

    return () => {
      removeListeners()
    }
  }, [isWalletConnected, removeListeners, setListeners])

  useEffect(() => {
    const getData = async () => {
      // get contract owner and set admin if connected account is owner
      const owner = await contract.owner()
      setIsAdmin(owner.toUpperCase() === account.toUpperCase())

      // get earnings info
      const earningsData = await contract.earnings()
      setEarnings(ethers.utils.formatEther(earningsData.toString()))

      // get booking rate
      const rateData = await contract.getRate()
      setRate(ethers.utils.formatEther(rateData.toString()))
    }

    getData()
  }, [contract, isCorrectChain, account])

  return (
    <>
      <Flex
        p={{ base: 4, md: 8 }}
        minWidth="max-content"
        alignItems="center"
        gap="2"
      >
        {isCorrectChain && account && isAdmin && (
          <MintTokensDrawer contract={contract} />
        )}
        {isCorrectChain && account && isAdmin && (
          <SetRateDrawer contract={contract} rate={rate} setRate={setRate} />
        )}
        {isCorrectChain && account && earnings && (
          <WithdrawEarningsButton
            contract={contract}
            earnings={earnings}
            setEarnings={setEarnings}
          />
        )}
        <Spacer />
        {!isCorrectChain && <div>Connect to Rinkeby</div>}
        {isCorrectChain && !account && (
          <Button
            onClick={connectWallet}
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
        {isCorrectChain && account && (
          <Tag size="lg" colorScheme="green" borderRadius="full">
            {shortAddress(account)}
          </Tag>
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
          <Text
            fontSize={{ base: 'sm', sm: 'md', md: 'xl' }}
            color={'gray.500'}
          >
            Own a share of your favorite property. Rent your favorite property.
            All on-chain!
          </Text>
          <Wrap
            direction={'row'}
            spacing={10}
            position={'relative'}
          >
            <PropertyInfoCard rate={rate} />
            {(!isCorrectChain || !account) && (
              <Center minW={300}>
                <Stack>
                  <Text fontSize="5xl">
                    Book Me!
                  </Text>
                  <Text>Connect to Rinkeby</Text>
                </Stack>
              </Center>
            )}
            {isCorrectChain && account && (
              <Calendar pl={12} contract={contract} rate={rate} />
            )}
          </Wrap>
        </Stack>
      </Container>
    </>
  )
}

export default App
