import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { RewardToken, RewardNft, Bank } from "../typechain-types";

describe("Bank", function () {
  async function deployRewardNft() {
    const [owner, otherAccount] = await ethers.getSigners();
    const RewardNft = await ethers.getContractFactory("RewardNft");
    const rewardNft = await RewardNft.deploy();
    return { rewardNft, owner, otherAccount };
  }
  async function deployRewardToken() {
    const [owner, otherAccount] = await ethers.getSigners();
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const maxSupply = 1234;
    const rewardToken = await RewardToken.deploy(maxSupply);
    return { rewardToken, owner, otherAccount };
  }
  async function deployBank() {
    const rewardNftContract = await deployRewardNft();
    const rewardTokenContract = await deployRewardToken();

    const [owner, otherAccount] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy(
      (
        await rewardTokenContract
      ).rewardToken.address,
      (
        await rewardNftContract
      ).rewardNft.address
    );

    //preSetUp
    await rewardNftContract.rewardNft.setBankContract(bank.address);
    await rewardTokenContract.rewardToken.setMinter(bank.address);
    await bank.depositPotMoney({ value: ethers.utils.parseEther("10") });
    return {
      bank,
      owner,
      otherAccount,
      rewardNftContract,
      rewardTokenContract,
    };
  }

  describe("Deposit", function () {
    it("should give ETH for interest", async function () {
      const { bank, owner, otherAccount } = await loadFixture(deployBank);
      await bank
        .connect(otherAccount)
        .deposit({ value: ethers.utils.parseEther("3") });
      const balanceAfterFirstDeposit = await otherAccount.getBalance();

      //7초 후 한번 더 디파짓 후 이자가 지급되었는지 확인한다. 7초간의 이자가 지급될 것임.
      await new Promise((resolve) => setTimeout(resolve, 7000));

      const tx = await bank
        .connect(otherAccount)
        .deposit({ value: ethers.utils.parseEther("3") });

      const result = await tx.wait();
      //console.log("receipt: ", result);
      let interestAmount = 0;

      if (result.events) {
        //console.log("receipt: ", result.events[0].args);
        if (result.events[0].args) {
          // reward가 0이 아니면서, canSend도 0이 아니면
          if (
            Number(result.events[0].args[1]) !== 0 &&
            Number(result.events[0].args[2]) !== 0
          ) {
            interestAmount = Number(result.events[0].args[1]);
          }
        }
      }
      expect(interestAmount).to.greaterThan(0);
    }),
      it("if the number of users deposited equal or over than 10, give user of rank1 nft", async function () {
        const { bank, owner, otherAccount, rewardNftContract } =
          await loadFixture(deployBank);
        const users = await ethers.getSigners();
        for (let i = 0; i < 10; i++) {
          const amount = i + 1;
          const ethAmount = { value: ethers.utils.parseEther(`${amount}`) };
          await bank.connect(users[i]).deposit(ethAmount);
        }
        const nftHolder = await rewardNftContract.rewardNft.ownerOf(0);
        expect(nftHolder).to.be.equal(users[9].address);
      });
  });
  describe("Withdraw", function () {
    it("should decrease balance", async function () {
      const { bank, owner, otherAccount, rewardNftContract } =
        await loadFixture(deployBank);

      await bank
        .connect(otherAccount)
        .deposit({ value: ethers.utils.parseEther("3") });

      await bank
        .connect(otherAccount)
        .withdraw(BigInt(Number(ethers.utils.parseEther("2"))));

      expect(
        (await bank.deposited(otherAccount.address)).balance
      ).to.be.lessThanOrEqual(BigInt(Number(ethers.utils.parseEther("1"))));
    });
  }),
    describe("Stake", function () {
      it("should decrease deposited", async function () {
        const { bank, owner, otherAccount, rewardNftContract } =
          await loadFixture(deployBank);

        await bank
          .connect(otherAccount)
          .deposit({ value: ethers.utils.parseEther("3") });

        await bank
          .connect(otherAccount)
          .stake(BigInt(Number(ethers.utils.parseEther("2"))));

        expect(
          (await bank.deposited(otherAccount.address)).balance
        ).to.be.lessThanOrEqual(BigInt(Number(ethers.utils.parseEther("1"))));
      }),
        it("should increase staked", async function () {
          const {
            bank,
            owner,
            otherAccount,
            rewardNftContract,
            rewardTokenContract,
          } = await loadFixture(deployBank);

          await bank
            .connect(otherAccount)
            .deposit({ value: ethers.utils.parseEther("3") });

          await bank
            .connect(otherAccount)
            .stake(BigInt(Number(ethers.utils.parseEther("2"))));

          expect(
            (await bank.staked(otherAccount.address)).balance
          ).to.be.greaterThan(0);
        }),
        it("should give ERC20 for interest", async function () {
          const { bank, owner, otherAccount, rewardNftContract } =
            await loadFixture(deployBank);

          await bank
            .connect(otherAccount)
            .deposit({ value: ethers.utils.parseEther("120") });

          await bank
            .connect(otherAccount)
            .stake(BigInt(Number(ethers.utils.parseEther("100"))));

          //7초 후 한번 더 stake 후 이자가 지급되었는지 확인한다. 7초간의 이자가 지급될 것임.
          await new Promise((resolve) => setTimeout(resolve, 7000));

          const tx = await bank
            .connect(otherAccount)
            .stake(BigInt(Number(ethers.utils.parseEther("10"))));

          const result = await tx.wait();
          //console.log("receipt: ", result);
          let interestAmount = 0;

          if (result.events) {
            //console.log("receipt: ", result.events);
            //console.log("receipt.events[1].args: ", result.events[1].args);
            if (result.events[1].args) {
              if (Number(result.events[1].args[1]) !== 0) {
                interestAmount = Number(result.events[1].args[1]);
              }
            }
          }
          expect(interestAmount).to.greaterThan(0);
        });
    });
  describe("Unstake", function () {
    it("should block after 24hours from claimReward", async function () {
      const { bank, owner, otherAccount, rewardNftContract } =
        await loadFixture(deployBank);

      await bank
        .connect(otherAccount)
        .deposit({ value: ethers.utils.parseEther("10") });

      await bank
        .connect(otherAccount)
        .stake(BigInt(Number(ethers.utils.parseEther("7"))));

      await expect(bank.unstake(BigInt(Number(ethers.utils.parseEther("2")))))
        .to.be.reverted;
    });
  });
  describe("CheckLeaderRankIn", function () {
    it("should be able to determine whether user balance exists within request number of rank", async function () {
      const { bank, owner, otherAccount, rewardNftContract } =
        await loadFixture(deployBank);

      const users = await ethers.getSigners();
      for (let i = 0; i < 10; i++) {
        const amount = i + 1;
        const ethAmount = { value: ethers.utils.parseEther(`${amount}`) };
        await bank.connect(users[i]).deposit(ethAmount);
      }

      const result = await bank.checkLeaderRankIn(users[6].address, 5);
      expect(result).to.be.equal(true);
    });
  }),
    describe("ShowLeaders", function () {
      it("should be able to sort current deposited users by balance from request number of rank", async function () {
        const { bank, owner, otherAccount, rewardNftContract } =
          await loadFixture(deployBank);

        const users = await ethers.getSigners();
        //console.log("users length: ", users.length);
        for (let i = 0; i < users.length; i++) {
          const amount = i + 1;
          const ethAmount = { value: ethers.utils.parseEther(`${amount}`) };
          await bank.connect(users[i]).deposit(ethAmount);
        }

        const usersBalanceArr = [];
        let result = true;

        let i = users.length - 1;

        // deposit 수량대로 내림차순 정렬
        while (i >= 0) {
          usersBalanceArr.push(users[i].address);
          i--;
        }
        const rankLists = await bank.showLeaders(users.length);

        // 만약 하나라도 순위가 틀리면 result 값을 false로 변경한다
        for (let i = 0; i < users.length; i++) {
          if (rankLists.users_[i] !== usersBalanceArr[i]) {
            result = false;
            break;
          }
        }
        expect(result).to.be.equal(true);
      });
    });
});
