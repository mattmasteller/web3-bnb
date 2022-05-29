import { Button, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { ethers } from 'ethers'
import abi from '../abis/Web3bnb.json'

// const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3' // localhost
const contractAddress = '0xf4EeD0468808D57f642fB635f7c85D03Ae2B4340' // rinkeby
const contractABI = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum)
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
)

const Calendar = ({ account }) => {
  // admin rate setting functionality
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [rate, setRate] = useState(false)
  // token info
  const [tokenSupply, setTokenSupply] = useState(0)
  // booking setting and storage
  const [bookings, setBookings] = useState([])

  const [selectedDays, setSelectedDays] = useState([])

  const disabledDays = [new Date(2022, 4, 29, 11), new Date(2022, 4, 30)]

  const getData = async () => {
    // get contract owner and set admin if connected account is owner
    const owner = await contract.owner()
    setIsAdmin(owner.toUpperCase() === account.toUpperCase())
    console.log('owner', owner)

    // get booking rate
    const rateData = await contract.getRate()
    setRate(ethers.utils.formatEther(rateData.toString()))
    console.log('rateData', rateData.toString())

    // get bookings data
    const bookingData = await contract.getBookings()
    console.log('bookingData', bookingData)
  }

  const handleDayClick = (day, modifiers) => {
    setSelectedDays((currentValue) => {
      const days = [...currentValue]
      if (modifiers.selected) {
        days.splice(currentValue.indexOf(day), 1)
      } else {
        days.push(day)
      }
      return days
    })
  }

  const handleResetClick = () => setSelectedDays([])

  const handleBookNowClick = () => {
    console.log('selectedDays', selectedDays)
    setSelectedDays([])
  }

  let footer = <Text>Please pick one or more days.</Text>

  if (selectedDays.length > 0)
    footer = <p>You selected {selectedDays.length} days. </p>

  const DaysList = () => {
    return selectedDays.map((d) => <div>{d.toString()}</div>)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <DayPicker
        onDayClick={handleDayClick}
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

      <DaysList />
    </>
  )
}

export default Calendar
