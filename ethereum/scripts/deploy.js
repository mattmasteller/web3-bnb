// yarn hardhat node
// yarn hardhat run ethereum/scripts/deploy.js --network rinkeby|localhost

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

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

  await contract.deployed()

  console.log('Web3bnb deployed to:', contract.address)

  const accounts = await hre.ethers.getSigners()
  console.log('owner address', accounts[0].address)

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
