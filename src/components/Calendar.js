import { Button, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import TxAlertDialog from './TxAlertDialog'

import { BigNumber, ethers } from 'ethers'
import abi from '../abis/Web3bnb.json'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum)
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
)

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString())
  return BigNumber.from(weiString)
}

const Calendar = ({ account }) => {
  // admin rate setting functionality
  const [rate, setRate] = useState(false)
  // booking setting and storage
  const [selectedDays, setSelectedDays] = useState([])
  const [disabledDays, setDisabledDays] = useState([])
  // tx dialog and progess indicators
  const [showTxDialog, setShowTxDialog] = useState(false)
  const [showTxSign, setShowTxSign] = useState(false)
  const [isTxMined, setIsTxMined] = useState(false)
  const [txHash, setTxHash] = useState('')

  const getData = async () => {
    // get booking rate
    const rateData = await contract.getRate()
    setRate(ethers.utils.formatEther(rateData.toString()))
    console.log('rateData', rateData.toString())

    // get bookings data
    const bookingData = await contract.getBookings()
    console.log('bookingData', bookingData)
    transformBookingData(bookingData)
  }

  const transformBookingData = (bookingData) => {
    let data = []
    bookingData.forEach((booking) => {
      booking.dates.forEach((bookingDate) => {
        data.push(new Date(bookingDate.toNumber() * 1000))
      })
    })

    setDisabledDays(data)
  }

  const handleResetClick = () => setSelectedDays([])

  const saveBooking = async (data) => {
    // convert selectedDays to unix times
    const dates = data.map((d) => d.getTime() / 1000)

    setShowTxDialog(true)
    setShowTxSign(true)
    setIsTxMined(false)

    try {
      const tx = await contract.createBooking(dates, {
        value: ether(rate * selectedDays.length),
      })

      setShowTxSign(false)

      await tx.wait()

      console.log('mine success', tx.hash)
      setIsTxMined(true)
      setTxHash(tx.hash)

      getData()
    } catch (error) {
      console.error('mine failure', error)
      setShowTxDialog(false)
    }
  }

  const handleBookNowClick = () => {
    saveBooking(selectedDays)
    setSelectedDays([])
  }

  let footer = <Text>Please pick one or more days. (max 7)</Text>

  if (selectedDays.length > 0)
    footer = (
      <p>
        You selected {selectedDays.length} days. ({rate * selectedDays.length}{' '}
        eth)
      </p>
    )

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Stack direction="column" spacing={3} align="center">
        <DayPicker
          onSelect={setSelectedDays}
          mode="multiple"
          min={1}
          max={7}
          disabled={disabledDays}
          selected={selectedDays}
          footer={footer}
        />
        <Stack direction="row" spacing={4} align="center">
          <Button
            colorScheme="green"
            disabled={selectedDays.length === 0}
            onClick={handleBookNowClick}
          >
            Book Now
          </Button>
          <Button
            variant="link"
            disabled={selectedDays.length === 0}
            onClick={handleResetClick}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
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

export default Calendar
