import { Button, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

const Calendar = ({ account }) => {
  const [selectedDays, setSelectedDays] = useState([])

  const disabledDays = [new Date(2022, 4, 29, 11), new Date(2022, 4, 30)]

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
    footer = (
      <p>
        You selected {selectedDays.length} days.{' '}
      </p>
    )

  const DaysList = () => {
    return selectedDays.map((d) => <div>{d.toString()}</div>)
  }

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
