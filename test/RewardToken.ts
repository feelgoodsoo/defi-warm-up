import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { RewardToken } from "../typechain-types";

describe("RewardToken", function () {
  async function deployRewardToken() {
    const [owner, otherAccount] = await ethers.getSigners();
    const RewardToken = await ethers.getContractFactory("RewardToken");

    const maxSupply = 1234;
    const rewardToken = await RewardToken.deploy(maxSupply);

    return { rewardToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("shoud inherit ERC20, Ownable", async function () {
      const { rewardToken, owner, otherAccount } = await loadFixture(
        deployRewardToken
      );
      expect(await rewardToken.owner()).to.equal(owner.address);
    }),
      it("should 6 for token decimals", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        expect(await rewardToken.decimals()).to.equal(6);
      });
  }),
    describe("Deposit", function () {
      it("should call mint", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.deposit({ value: ethers.utils.parseEther("3") });
        expect(
          Number(await rewardToken.balanceOf(owner.address))
        ).to.greaterThan(Number(0));
      });
    }),
    describe("Withdraw", async function () {
      it("should retrieve ETH", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );

        await rewardToken.deposit({ value: ethers.utils.parseEther("3") });
        const withdrawBeforeETH = await owner.getBalance();
        const amountToken = (2 * 1e18) / (100 * 1e12);
        await rewardToken.withdraw(amountToken - 10000);
        const withdrawAfterETH = await owner.getBalance();

        expect(withdrawAfterETH).to.greaterThan(withdrawBeforeETH);
      }),
        it("should give back reward token", async function () {
          const { rewardToken, owner, otherAccount } = await loadFixture(
            deployRewardToken
          );

          await rewardToken.deposit({ value: ethers.utils.parseEther("3") });
          const withdrawBeforeToken = await rewardToken.balanceOf(
            owner.address
          );
          const amountToken = (2 * 1e18) / (100 * 1e12);
          await rewardToken.withdraw(amountToken - 10000);
          const withdrawAfterToken = await rewardToken.balanceOf(owner.address);

          expect(withdrawAfterToken).to.lessThan(withdrawBeforeToken);
        });
    });
  describe("Mint", function () {
    it("should be called by admins", async function () {
      const { rewardToken, owner, otherAccount } = await loadFixture(
        deployRewardToken
      );

      await expect(rewardToken.connect(otherAccount).mint(owner.address, 1e6))
        .to.be.reverted;
    }),
      it("should be minted", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.mint(owner.address, 2 * 1e6);
        expect(await rewardToken.balanceOf(owner.address)).to.greaterThan(0);
      });
  }),
    describe("SetMinter", function () {
      it("should be called by owner", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        const newOwner = "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97";
        await rewardToken.transferOwnership(newOwner);
        await expect(rewardToken.setMinter(owner.address)).to.be.reverted;
      }),
        it("should be set minter", async function () {
          const { rewardToken, owner, otherAccount } = await loadFixture(
            deployRewardToken
          );
          await rewardToken.setMinter(otherAccount.address);
          expect(
            await rewardToken.connect(otherAccount).mint(owner.address, 1e6)
          ).not.to.be.reverted;
        });
    });
  describe("UpdateSwapRatio", function () {
    it("should be called by owner", async function () {
      const { rewardToken, owner, otherAccount } = await loadFixture(
        deployRewardToken
      );
      await expect(rewardToken.connect(otherAccount).updateSwapRatio(1e10)).to
        .be.reverted;
    }),
      it("should be failed when nextSwapRatio <= rewardToken", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await expect(rewardToken.updateSwapRatio(1e10)).to.be.reverted;
      }),
      it("should be succeeded when nexSwapRatio > rewardToken", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );

        await rewardToken.deposit({ value: ethers.utils.parseEther("3") });
        //console.log("realRatio: ", await rewardToken.realRatio());
        await expect(rewardToken.updateSwapRatio(1e10)).not.to.be.reverted;
      });
  });

  describe("Pause", function () {
    it("should be called by owner", async function () {
      const { rewardToken, owner, otherAccount } = await loadFixture(
        deployRewardToken
      );
      await expect(rewardToken.connect(otherAccount).pause()).to.be.reverted;
    }),
      it("if it's paused, should not be able to mint", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.pause();

        await expect(rewardToken.mint(owner.address, 1e13)).to.be.reverted;
      }),
      it("if it's paused, should not be able to deposit", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.pause();

        await expect(
          rewardToken.deposit({ value: ethers.utils.parseEther("3") })
        ).to.be.reverted;
      }),
      it("if it's paused, should not be able to withdraw", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.pause();
        await expect(rewardToken.withdraw(1e12)).to.be.reverted;
      }),
      it("should be able to unpause", async function () {
        const { rewardToken, owner, otherAccount } = await loadFixture(
          deployRewardToken
        );
        await rewardToken.pause();
        //console.log("paused: ", await rewardToken.paused());
        await rewardToken.pause();
        //console.log("paused: ", await rewardToken.paused());

        await expect(
          rewardToken.deposit({ value: ethers.utils.parseEther("3") })
        ).not.to.be.reverted;
      });
  });
});
