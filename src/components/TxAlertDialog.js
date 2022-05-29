import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Flex,
  Progress,
  Spacer,
  Text,
} from '@chakra-ui/react'

const TxAlertDialog = ({ showTxSign, isTxMined, txHash, onClick }) => {
  return (
    <AlertDialog isOpen={true} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Blockchain Transaction
          </AlertDialogHeader>

          <AlertDialogBody>
            {!isTxMined && showTxSign && <div>Please sign the transaction.</div>}
            {!isTxMined && !showTxSign && (
              <Progress mt={4} size="xs" isIndeterminate />
            )}
            {isTxMined && <div>Your transaction has been confirmed.</div>}
          </AlertDialogBody>

          <AlertDialogFooter minH={20}>
            {isTxMined && (
              <Flex gap={3} alignItems="center">
                <a
                  href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Text as="u" color="gray.600">
                    View on Etherscan
                  </Text>
                </a>
                <Spacer />
                <Button onClick={onClick}>Close</Button>
              </Flex>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default TxAlertDialog
