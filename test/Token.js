const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')

describe('Token', function () {
  async function deployTokenFixture() {
    const [deployer, to] = await ethers.getSigners()
    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    return { token, deployer, to }
  }

  describe('Deployment', function () {
    it('Should have the correct name', async () => {
      const { token } = await loadFixture(deployTokenFixture)
      expect(await token.name()).to.equal('Nader Dabit Token')
    })

    it('Should have the correct symbol', async () => {
      const { token } = await loadFixture(deployTokenFixture)
      expect(await token.symbol()).to.equal('NDT')
    })

    it('Should have the correct total suppy', async () => {
      const { token } = await loadFixture(deployTokenFixture)
      expect(await token.totalSupply()).to.equal(1000000)
    })

    it('Should have correct balance for deployer', async () => {
      const { token, deployer } = await loadFixture(deployTokenFixture)
      expect(await token.balanceOf(deployer.address)).to.equal(1000000)
    })
  })

  describe('Transfer', () => {
    it('Should have correct balances from/to', async () => {
      const { token, to } = await loadFixture(deployTokenFixture)
      await token.transfer(to.address, 1_000)
      expect(await token.balanceOf(to.address)).to.equal(1_000)
    })

    it('Should fail if sender not enough balance', async () => {
      const { token, deployer, to } = await loadFixture(deployTokenFixture)
      expect(token.connect(to).transfer(deployer.address, 1)).to.be.revertedWith('Not enough tokens')
    })
  })
})
