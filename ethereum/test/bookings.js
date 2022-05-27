const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Web3bnb - bookings', function () {
  let Contract, contract
  let owner, addr1, addr2

  // `beforeEach` will run before each test
  beforeEach(async function () {
    ;[owner, addr1, addr2] = await ethers.getSigners()

    Contract = await ethers.getContractFactory('Web3bnb')
    contract = await Contract.deploy('Web3bnb Token', '3BNB')
    await contract.deployed()

    // Mint tokens
    await contract.mint(addr1.address, 100)
  })

  it('Should set rate', async function () {
    await contract.setRate(1000)
    // verify rate is set correctly
    expect(await contract.getRate()).to.equal(1000)
  })

  it('Should fail if non-owner rate', async function () {
    // call setRate using a different account address
    // this should fail since this address is not the owner
    await expect(contract.connect(addr1).setRate(500)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Should add two bookings', async function () {
    await contract.setRate(ethers.utils.parseEther('0.001'))

    await contract.connect(addr1).createBooking(1644143400, 1644150600, {
      value: ethers.utils.parseEther('2'),
    })

    await contract.connect(addr2).createBooking(1644154200, 1644159600, {
      value: ethers.utils.parseEther('1.5'),
    })

    const bookings = await contract.getBookings()

    expect(bookings.length).to.equal(2)
  })
})
