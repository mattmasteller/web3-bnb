import { useEffect, useRef, useState } from 'react'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'

import TxAlertDialog from './TxAlertDialog'

const MintTokensDrawer = ({ contract }) => {
  // drawer state
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  // token info
  const [totalTokenSupply, setTotalTokenSupply] = useState(0)
  const [maxTokenSupply, setMaxTokenSupply] = useState(0)
  // tx dialog and progess indicators
  const [showTxDialog, setShowTxDialog] = useState(false)
  const [showTxSign, setShowTxSign] = useState(false)
  const [isTxMined, setIsTxMined] = useState(false)
  const [txHash, setTxHash] = useState('')

  const getData = async () => {
    // get token info
    const totalTokenSupplyData = await contract.totalSupply()
    setTotalTokenSupply(
      totalTokenSupplyData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )

    const maxTokenSupplyData = await contract.maxSupply()
    setMaxTokenSupply(
      maxTokenSupplyData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )
  }

  useEffect(() => {
    getData()
  }, [])

  const mintTokens = async (e) => {
    e.preventDefault()

    const address = e.target.address.value
    const amount = e.target.amount.value
    if (address === '' || amount === '') {
      alert('Please enter address and amount.')
      return
    }

    onClose()

    setShowTxSign(true)
    setShowTxDialog(true)
    setIsTxMined(false)

    try {
      const tx = await contract.mint(address, amount)

      setShowTxSign(false)

      await tx.wait()

      console.log('mine success', tx.hash)

      setIsTxMined(true)
      setTxHash(tx.hash)

      getData()
    } catch (error) {
      console.log('mine failure', error)
    }
  }

  return (
    <>
      <Button ref={btnRef} colorScheme="green" onClick={onOpen}>
        Mint Tokens
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Mint Tokens</DrawerHeader>

          <DrawerBody>
            <Stat>
              <StatLabel>Total Supply</StatLabel>
              <StatNumber>{totalTokenSupply}</StatNumber>
              <StatHelpText>{maxTokenSupply} Max Supply</StatHelpText>
            </Stat>
            <form
              id="mint-tokens"
              onSubmit={(e) => {
                mintTokens(e)
              }}
            >
              <Input mt={8} name="address" placeholder="Ethereum Address..." />
              <Input mt={4} name="amount" placeholder="Number of Tokens..." />
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="mint-tokens" colorScheme="green">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {showTxDialog && (
        <TxAlertDialog
          showTxSign={showTxSign}
          isTxMined={isTxMined}
          txHash={txHash}
          onClick={() => setShowTxDialog(false)}
        />
      )}
    </>
  )
}

export default MintTokensDrawer
