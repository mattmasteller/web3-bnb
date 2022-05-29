import { useEffect, useState } from 'react'
import { Box, Image, Badge } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'

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

const PropertyInfoCard = ({ account }) => {
  const [rate, setRate] = useState(0)

  const getData = async () => {
    // get booking rate
    const rateData = await contract.getRate()
    setRate(ethers.utils.formatEther(rateData.toString()))
    console.log('PropertyInfoCard.getData rateData', rateData.toString())
  }

  useEffect(() => {
    console.log('PropertyInfoCard getData()')
    getData()
  }, [contract])

  let property = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
    imageAlt: 'Rear view of modern home with pool',
    beds: 3,
    baths: 2,
    title: 'Modern home in city center in the heart of historic Los Angeles',
    reviewCount: 34,
    rating: 4,
  }

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      align="left"
    >
      <Image src={property.imageUrl} alt={property.imageAlt} />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {property.beds} beds &bull; {property.baths} baths
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {property.title}
        </Box>

        <Box>
          {rate}
          <Box as="span" color="gray.600" fontSize="sm">
            {' '}
            eth/night
          </Box>
        </Box>

        <Box display="flex" mt="2" alignItems="center">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? 'teal.500' : 'gray.300'}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} reviews
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PropertyInfoCard
