import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { Button } from '@chakra-ui/react'

import TxAlertDialog from './TxAlertDialog'

const WithdrawEarningsButton = ({ contract }) => {
  // shareholder functionality
  const [earnings, setEarnings] = useState(false)
  // tx dialog and progess indicators
  const [showTxDialog, setShowTxDialog] = useState(false)
  const [showTxSign, setShowTxSign] = useState(false)
  const [isTxMined, setIsTxMined] = useState(false)
  const [txHash, setTxHash] = useState('')

  const getData = async () => {
    // get earnings info
    const earningsData = await contract.earnings()
    setEarnings(ethers.utils.formatEther(earningsData.toString()))
  }

  useEffect(() => {
    getData()
  }, [])

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

      getData()
    } catch (error) {
      console.log('mine failure', error)
    }
  }

  return (
    <>
      <Button size="xs" colorScheme="green" onClick={withdrawEarningsTxn}>
        Withdraw {earnings} eth{' '}
      </Button>
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
