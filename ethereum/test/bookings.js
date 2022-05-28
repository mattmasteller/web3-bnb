const { expect } = require('chai')
const { ethers } = require('hardhat')
const { BigNumber } = require('ethers')

// Utils

const Assertion = require('chai').Assertion

Assertion.addMethod('approx', function (n, delta = 0.02) {
  const diffPercentage = Math.abs((n - this._obj) / n)
  new Assertion(diffPercentage).to.lte(delta)
})

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString())
  return BigNumber.from(weiString)
}

// Tests

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
    await contract.setRate(ether(0.1))
  })

  it('Should set rate', async function () {
    await contract.setRate(1000)
    // verify rate is set correctly
    expect(await contract.getRate()).to.equal(1000)
  })

  it('Should fail if non-owner tries to set rate', async function () {
    // call setRate using a different account address
    // this should fail since this address is not the owner
    await expect(contract.connect(addr1).setRate(500)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Should add two bookings', async function () {
    await contract.connect(addr1).createBooking2([1644143400], {
      value: ether(0.2),
    })

    await contract.connect(addr2).createBooking2([1644154200], {
      value: ether(0.2),
    })

    const bookings = await contract.getBookings()

    expect(bookings.length).to.equal(2)
  })

  it('Should add booking with multiple days', async function () {
    await contract.connect(addr2).createBooking2([1644143400, 1644150600], {
      value: ether(0.2),
    })

    const bookings = await contract.getBookings()

    expect(bookings.length).to.equal(1)
  })

  it('Should not allow more than max days booked', async function () {
    await expect(
      contract.connect(addr1).createBooking2(
        [
          // 12 bookings exced the max of 10
          1644143400, 1644229800, 1644143401, 1644229801, 1644143402,
          1644229802, 1644143403, 1644229803, 1644143404, 1644229804,
          1644143405, 1644229805,
        ],
        {
          value: ether(0.2),
        }
      )
    ).to.be.revertedWith('Max booking days exceeded')
  })

  it('Should not allow booking on the same day', async function () {
    await contract.connect(addr1).createBooking2([1644143400, 1644150600], {
      value: ether(0.2),
    })

    await expect(
      contract.connect(addr2).createBooking2([1644143400, 1644150600], {
        value: ether(0.2),
      })
    ).to.be.revertedWith('Date already booked')
  })
})
