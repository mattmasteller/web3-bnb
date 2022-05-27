import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react'

function App() {
  return (
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
          them loyalty points. Give back to your loyal readers by granting them
          access to your pre-releases and sneak-peaks.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          <Button
            colorScheme={'green'}
            bg={'green.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'green.500',
            }}
          >
            Connect your Wallet
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default App
