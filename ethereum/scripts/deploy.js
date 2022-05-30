// yarn hardhat node
// yarn hardhat run ethereum/scripts/deploy.js --network rinkeby|localhost

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const ether = (amount) => {
  const weiString = hre.ethers.utils.parseEther(amount.toString())
  return hre.ethers.BigNumber.from(weiString)
}

function saveFrontendFiles() {
  const fs = require('fs')

  const abiDir = __dirname + '/../../src/abis'

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir)
  }

  const artifact = hre.artifacts.readArtifactSync('Web3bnb')

  fs.writeFileSync(abiDir + '/Web3bnb.json', JSON.stringify(artifact, null, 2))
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Contract = await hre.ethers.getContractFactory('Web3bnb')
  const contract = await Contract.deploy('Web3bnb Token', '3BNB')

  // Deploy contract
  await contract.deployed()
  console.log('Web3bnb deployed to:', contract.address)

  const accounts = await hre.ethers.getSigners()
  console.log('Owner address', accounts[0].address)

  // Setup defaults
  console.log('Setup Defaults:')
  // Mint 1000 tokens to owner
  await contract.mint(accounts[0].address, 1000)
  console.log('  Minted 1000 tokens to', accounts[0].address)
  // Set rental rate to 0.1 eth
  await contract.setRate(ether(0.1))
  console.log('  Set rental rate to 0.1 eth')
  // Unlock for withdrawals
  await contract.toggleLock()
  console.log('  Unlocked contract for earnings withdrawals')

  // Copy ABI file to frontend project
  saveFrontendFiles()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
