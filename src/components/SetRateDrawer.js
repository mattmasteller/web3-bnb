import { useEffect, useRef, useState } from 'react'
import { BigNumber, ethers } from 'ethers'

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

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount)
  return BigNumber.from(weiString)
}

const SetRateDrawer = ({ contract }) => {
  // drawer state
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  // rate info
  const [rate, setRate] = useState(false)
  // tx dialog and progess indicators
  const [showTxDialog, setShowTxDialog] = useState(false)
  const [showTxSign, setShowTxSign] = useState(false)
  const [isTxMined, setIsTxMined] = useState(false)
  const [txHash, setTxHash] = useState('')

  const getData = async () => {
    // get booking rate
    const rateData = await contract.getRate()
    setRate(ethers.utils.formatEther(rateData.toString()))
  }

  useEffect(() => {
    getData()
  }, [])

  const setRateTxn = async (e) => {
    e.preventDefault()

    console.log('e', e)

    const rate = e.target.rate.value
    if (rate === '') {
      alert('Please enter rate.')
      return
    }

    onClose()

    setShowTxSign(true)
    setShowTxDialog(true)
    setIsTxMined(false)

    try {
      const tx = await contract.setRate(ether(rate))

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
      <Button size="xs" ref={btnRef} colorScheme="green" onClick={onOpen}>
        Set Rate
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
          <DrawerHeader>Set Rate</DrawerHeader>

          <DrawerBody>
            <Stat>
              <StatLabel>Current Rate</StatLabel>
              <StatNumber>{rate}</StatNumber>
              <StatHelpText>ETH/night</StatHelpText>
            </Stat>
            <form
              id="set-rate"
              onSubmit={(e) => {
                setRateTxn(e)
              }}
            >
              <Input mt={8} name="rate" placeholder="Rate..." />
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="set-rate" colorScheme="green">
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

export default SetRateDrawer
