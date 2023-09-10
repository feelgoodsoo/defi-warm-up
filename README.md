## About

- this project implements simple-banking system with ETH
- including ERC-721, ERC-20 contracts
- to get more information, checkout contracts

## Setup

```bash
npm install
```

```bash
npx hardhat compile
```

## To Start from Remix

- 1.deploy RewardNft.sol
- 2.deploy RewardToken.sol
- 3.deploy Bank.sol
- 4.deploy Router.sol
- 5.call setBankContract() function in RewardNft.sol (input Param: BankAddress)
- 6.call setMinter() function in RewardToken.sol (input Param: BankAddress)
- 7.call depositPotMoney() function in Bank.sol (from Admin Wallet)
- now you can test deposit, stake.. etc

## To Start from hardahat

```bash
npm run test
```
