import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { RewardNft } from "../typechain-types";

describe("RewardNft", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRewardNft() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const RewardNft = await ethers.getContractFactory("RewardNft");
    const rewardNft = await RewardNft.deploy();

    return { rewardNft, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("should inherit ERC721 and be Ownable", async function () {
      const { rewardNft, owner, otherAccount } = await loadFixture(
        deployRewardNft
      );
      expect(await rewardNft.owner()).to.equal(owner.address);
    }),
      it("should allow transfer of ownership", async function () {
        const { rewardNft, owner, otherAccount } = await loadFixture(
          deployRewardNft
        );
        const newOwner = "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97";
        await rewardNft.transferOwnership(newOwner);
        expect(await rewardNft.owner()).to.equal(newOwner);
      });
  });

  describe("Mint", function () {
    it("should use onlyOwner modifier", async function () {
      const { rewardNft, owner, otherAccount } = await loadFixture(
        deployRewardNft
      );

      // onlyOwner를 체크하기 위해 owner를 변경해준다.
      // 현재 ethers 인스턴스의 wallet address는 owner다. 즉, 현재의 msg.sender는 owner이고 지금 owner를 교체했으니 revert가 날 것이다.
      const newOwner = "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97";
      await rewardNft.transferOwnership(newOwner);

      await expect(
        rewardNft.mint(
          "0xa27CEF8aF2B6575903b676e5644657FAe96F491F",
          "ipfs://hello.json"
        )
      ).to.be.revertedWith("Not authorized");
    }),
      it("tokenId should start from 0, and increase 1 each mint", async function () {
        const { rewardNft, owner, otherAccount } = await loadFixture(
          deployRewardNft
        );
        const to = "0xa27CEF8aF2B6575903b676e5644657FAe96F491F";
        // first mint
        await rewardNft.mint(to, "ipfs://hello.json");
        // second mint
        await rewardNft.mint(to, "ipfs://hello22.json");

        expect(await rewardNft.tokenURI(1)).to.equal("ipfs://hello22.json");
      });
  });
});
