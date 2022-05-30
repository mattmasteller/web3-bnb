import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { Button } from '@chakra-ui/react'

import TxAlertDialog from './TxAlertDialog'

const WithdrawEarningsButton = ({ contract, earnings, setEarnings }) => {
  // tx dialog and progess indicators
  const [showTxDialog, setShowTxDialog] = useState(false)
  const [showTxSign, setShowTxSign] = useState(false)
  const [isTxMined, setIsTxMined] = useState(false)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    const getData = async () => {
      // get earnings info
      const earningsData = await contract.earnings()
      setEarnings(ethers.utils.formatEther(earningsData.toString()))
    }

    getData()
  }, [contract, setEarnings, txHash])

  const withdrawEarningsTxn = async () => {
    setShowTxSign(true)
    setShowTxDialog(true)
    setIsTxMined(false)

    try {
      const tx = await contract.withdraw()

      setShowTxSign(false)

      await tx.wait()

      console.log('mine success', tx.hash)

      setIsTxMined(true)
      setTxHash(tx.hash)
    } catch (error) {
      console.log('mine failure', error)
    }
  }

  return (
    <>
      {earnings !== '0.0' && (
        <Button size="xs" colorScheme="green" onClick={withdrawEarningsTxn}>
          Withdraw {earnings} eth{' '}
        </Button>
      )}

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

export default WithdrawEarningsButton
