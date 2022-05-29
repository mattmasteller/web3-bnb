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

describe('Web3bnb - token', () => {
  let Contract, contract
  let owner, alice, bob, carol, renter1

  beforeEach('', async () => {
    ;[owner, alice, bob, carol, renter1] = await ethers.getSigners()

    Contract = await ethers.getContractFactory('Web3bnb')
    contract = await Contract.deploy('Web3bnb Token', '3BNB')
    await contract.deployed()
    await contract.setRate(ether(1))
  })

  it('Ensure token deployed properly', async () => {
    expect(await contract.name()).to.eq('Web3bnb Token')
    expect(await contract.symbol()).to.eq('3BNB')
    expect(await contract.getRate()).to.eq(ether(1))
  })

  describe('ERC20 mint related tests', async () => {
    it('mint() -- owner minting quantity for alice', async () => {
      await contract.mint(alice.address, 1e6)
      expect(await contract.balanceOf(alice.address)).to.eq(1e6)
    })
    it('mint() -- non-owner trying to mint, should revert', async () => {
      await expect(
        contract.connect(alice).mint(owner.address, ether(1))
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('Withdrawal related tests', () => {
    it('withdraw() -- Trying to call while locked, should revert', async () => {
      await expect(contract.connect(alice).withdraw()).to.be.revertedWith(
        'Contract is currently locked'
      )
    })

    it('withdraw() -- Ensure dividends are distributed properly', async () => {
      // Get initial balances
      const aliceBalance1 = await ethers.provider.getBalance(alice.address)
      const bobBalance1 = await ethers.provider.getBalance(bob.address)

      // Mint tokens
      await contract.mint(alice.address, 60)
      await contract.mint(bob.address, 40)

      // Collect revenue
      await contract.connect(renter1).createBooking([1644143400], {
        value: ether(1),
      })

      // Withdraw dividends
      await contract.toggleLock()
      await contract.connect(alice).withdraw()
      await contract.connect(bob).withdraw()

      // Calculate balances after withdrawals
      const aliceBalance2 = await ethers.provider.getBalance(alice.address)
      const bobBalance2 = await ethers.provider.getBalance(bob.address)
      const aliceWithdrawal = aliceBalance2.sub(aliceBalance1)
      const bobWithdrawal = bobBalance2.sub(bobBalance1)

      expect(ethers.utils.formatEther(aliceWithdrawal)).to.approx(60 / 100)
      expect(ethers.utils.formatEther(bobWithdrawal)).to.approx(40 / 100)
    })

    it('withdraw() -- Ensure dividends are distributed properly after partial token transfers', async () => {
      // Get initial balances
      const aliceBalance1 = await ethers.provider.getBalance(alice.address)
      const bobBalance1 = await ethers.provider.getBalance(bob.address)
      const carolBalance1 = await ethers.provider.getBalance(carol.address)

      // Mint tokens
      await contract.mint(alice.address, 60)
      await contract.mint(bob.address, 40)

      // Collect revenue
      await contract.connect(renter1).createBooking([1644143400], {
        value: ether(1),
      })

      // Transfer tokens
      await contract.connect(alice).transfer(carol.address, 30)

      expect(await contract.balanceOf(alice.address)).to.eq(30)
      expect(await contract.balanceOf(carol.address)).to.eq(30)

      // Collect more revenue
      await contract.connect(renter1).createBooking([1644143600], {
        value: ether(1),
      })

      // Withdraw dividends
      await contract.toggleLock()
      await contract.connect(alice).withdraw()
      await contract.connect(bob).withdraw()
      await contract.connect(carol).withdraw()

      // Calculate balances after withdrawals
      const aliceBalance2 = await ethers.provider.getBalance(alice.address)
      const aliceWithdrawal = aliceBalance2.sub(aliceBalance1)
      const bobBalance2 = await ethers.provider.getBalance(bob.address)
      const bobWithdrawal = bobBalance2.sub(bobBalance1)
      const carolBalance2 = await ethers.provider.getBalance(carol.address)
      const carolWithdrawal = carolBalance2.sub(carolBalance1)

      expect(ethers.utils.formatEther(aliceWithdrawal)).to.approx(0.9)
      expect(ethers.utils.formatEther(bobWithdrawal)).to.approx(0.8)
      expect(ethers.utils.formatEther(carolWithdrawal)).to.approx(0.3)
    })

    it('withdraw() -- Ensure dividends are distributed properly after total token transfers', async () => {
      // Get initial balances
      const aliceBalance1 = await ethers.provider.getBalance(alice.address)
      const bobBalance1 = await ethers.provider.getBalance(bob.address)
      const carolBalance1 = await ethers.provider.getBalance(carol.address)

      // Mint tokens
      await contract.mint(alice.address, 60)
      await contract.mint(bob.address, 40)

      // Collect revenue
      await contract.connect(renter1).createBooking([1644143400], {
        value: ether(1),
      })

      // Transfer tokens
      await contract.connect(alice).transfer(carol.address, 60)

      // Collect more revenue
      await contract.connect(renter1).createBooking([1644143600], {
        value: ether(1),
      })

      // Withdraw dividends
      await contract.toggleLock()
      await contract.connect(alice).withdraw()
      await contract.connect(bob).withdraw()
      await contract.connect(carol).withdraw()

      // Calculate balances after withdrawals
      const aliceBalance2 = await ethers.provider.getBalance(alice.address)
      const aliceWithdrawal = aliceBalance2.sub(aliceBalance1)
      const bobBalance2 = await ethers.provider.getBalance(bob.address)
      const bobWithdrawal = bobBalance2.sub(bobBalance1)
      const carolBalance2 = await ethers.provider.getBalance(carol.address)
      const carolWithdrawal = carolBalance2.sub(carolBalance1)

      expect(ethers.utils.formatEther(aliceWithdrawal)).to.approx(0.6 + 0)
      expect(ethers.utils.formatEther(bobWithdrawal)).to.approx(0.4 + 0.4)
      expect(ethers.utils.formatEther(carolWithdrawal)).to.approx(0 + 0.6)
    })

    it('withdraw() -- Ensure dividends are distributed properly after new token mint', async () => {
      // Get initial balances
      const aliceBalance1 = await ethers.provider.getBalance(alice.address)
      const bobBalance1 = await ethers.provider.getBalance(bob.address)
      const carolBalance1 = await ethers.provider.getBalance(carol.address)

      // Mint tokens
      await contract.mint(alice.address, 30)
      await contract.mint(bob.address, 20)

      // Collect revenue
      await contract.connect(renter1).createBooking([1644143400], {
        value: ether(1),
      })

      // Mint new tokens
      await contract.mint(carol.address, 50)

      // Collect more revenue
      await contract.connect(renter1).createBooking([1644143600], {
        value: ether(1),
      })

      // Withdraw dividends
      await contract.toggleLock()
      await contract.connect(alice).withdraw()
      await contract.connect(bob).withdraw()
      await contract.connect(carol).withdraw()

      // Calculate balances after withdrawals
      const aliceBalance2 = await ethers.provider.getBalance(alice.address)
      const aliceWithdrawal = aliceBalance2.sub(aliceBalance1)
      const bobBalance2 = await ethers.provider.getBalance(bob.address)
      const bobWithdrawal = bobBalance2.sub(bobBalance1)
      const carolBalance2 = await ethers.provider.getBalance(carol.address)
      const carolWithdrawal = carolBalance2.sub(carolBalance1)

      expect(ethers.utils.formatEther(aliceWithdrawal)).to.approx(
        30 / 50 + 30 / 100
      )
      expect(ethers.utils.formatEther(bobWithdrawal)).to.approx(
        20 / 50 + 20 / 100
      )
      expect(ethers.utils.formatEther(carolWithdrawal)).to.approx(0 + 50 / 100)
    })
  })

  describe('Other tests', async () => {
    it('testing approx success', async () => {
      expect(98).to.approx(100)
      expect(90).to.approx(100, 0.1)
    })
  })
})
