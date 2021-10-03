import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'
import { CodeshiToken } from '../typechain/CodeshiToken'

let codeshiToken : CodeshiToken;
let owner : SignerWithAddress
let guest : SignerWithAddress
let otherUser : SignerWithAddress
 
// Start test block
describe('Codeshi (proxy)', function () {
  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0]
    guest = signers[1]
    otherUser = signers[2]
    const Codeshi = await ethers.getContractFactory("CodeshiToken", owner);
    codeshiToken = await upgrades.deployProxy(Codeshi, [], { initializer: 'setup' }) as CodeshiToken;
  });
 
  it('Just check symbol', async function () {
    expect((await codeshiToken.symbol()).toString()).to.equal('CX');
  });

  it('#getLatestTweet', async function() {
    const dividends = [
      { target: otherUser.address, amount: 1 }
    ]

    await codeshiToken.dividends(dividends, "https://twitter.com/ethereum")

    expect(await codeshiToken.getLatestTweet()).to.eq("https://twitter.com/ethereum")

    await codeshiToken.dividends(dividends, "https://duckduckgo.com")

    expect(await codeshiToken.getLatestTweet()).to.eq("https://duckduckgo.com")
  });

  describe('#minting', function() {
    it('only owner should be able to mint new tokens', async function () {
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
      await codeshiToken.mint(otherUser.address, 10)
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(10)
    })
  
    it('other user cannot mint tokens', async function () {
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
      
      await expect(
        codeshiToken.connect(guest).mint(otherUser.address, 8)
      ).to.be.revertedWith("must have minter role to mint");
  
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
    })
  })

  describe('#dividends', function() {
    it('only owner should be able to mint new tokens', async function () {
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
      expect(await codeshiToken.balanceOf(guest.address)).to.eq(0)
      expect(await codeshiToken.balanceOf(owner.address)).to.eq(0)

      const dividends = [
        { target: otherUser.address, amount: 1 },
        { target: guest.address, amount: 2 },
        { target: owner.address, amount: 3 }
      ]

      await codeshiToken.dividends(dividends, "https://twitter.com/ethereum")

      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(1)
      expect(await codeshiToken.balanceOf(guest.address)).to.eq(2)
      expect(await codeshiToken.balanceOf(owner.address)).to.eq(3)
    })
  
    it('other user cannot mint tokens', async function () {
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
      const dividends = [
        { target: otherUser.address, amount: 1 },
        { target: guest.address, amount: 2 },
        { target: owner.address, amount: 3 }
      ]

      await expect(
        codeshiToken.connect(guest).dividends(dividends, "https://twitter.com/ethereum")
      ).to.be.revertedWith("must have minter role to mint");
  
      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(0)
    })
  })

  describe('#order', () => {
    async function order(signer : SignerWithAddress, runner: SignerWithAddress, amount : number, nonce : number, productId : string) {
      const hash = ethers.utils.solidityKeccak256(['uint256', 'uint256', 'string', 'address'], [amount, nonce, productId, runner.address]);
      const sig = await signer.signMessage(ethers.utils.arrayify(hash));
      return codeshiToken.connect(runner).order(amount, nonce, productId, sig);
    }

    it('prevents order if you dont have enough codeshi', async function () {
      await expect(
        order(owner, otherUser, 30, 10, "productid")
      ).to.be.revertedWith("revert ERC20: burn amount exceeds balance");
    })

    it('requires minter to sign the message', async function () {
      await expect(
        order(otherUser, otherUser, 30, 10, "productid")
      ).to.be.revertedWith("CodeshiToken: signature is not created by minter!");
    })

    it('prevents using the same receipt twice', async function () {
      await codeshiToken.mint(otherUser.address, 40)
      await order(owner, otherUser, 10, 5, "productId")

      await expect(
        order(owner, otherUser, 10, 5, "productId")
      ).to.be.revertedWith("CodeshiToken: already used this nonce");
    })

    it('burns codeshi and creates new order', async function () {
      await codeshiToken.mint(otherUser.address, 40)

      await expect(order(owner, otherUser, 30, 10, "productId")).to.emit(codeshiToken, 'NewOrder').withArgs(otherUser.address, "productId");

      expect(await codeshiToken.balanceOf(otherUser.address)).to.eq(10)
      expect((await codeshiToken.getOrdersFor(otherUser.address)).length).to.eq(1)
    })
  })
});