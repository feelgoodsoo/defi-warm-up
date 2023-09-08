/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  RewardToken,
  RewardTokenInterface,
} from "../../contracts/RewardToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxSupply_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "SetMinter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "swapRatio",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "UpdateSwapRatio",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isNotPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "realRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "minter_",
        type: "address",
      },
    ],
    name: "setMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "swapRatio_",
        type: "uint256",
      },
    ],
    name: "updateSwapRatio",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002aad38038062002aad833981810160405281019062000037919062000263565b6040518060400160405280600781526020017f50616369666963000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f50414300000000000000000000000000000000000000000000000000000000008152508160039081620000b4919062000505565b508060049081620000c6919062000505565b505050620000e9620000dd6200015560201b60201c565b6200015d60201b60201c565b655af3107a40006006819055506001600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050620005ec565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b6000819050919050565b6200023d8162000228565b81146200024957600080fd5b50565b6000815190506200025d8162000232565b92915050565b6000602082840312156200027c576200027b62000223565b5b60006200028c848285016200024c565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200031757607f821691505b6020821081036200032d576200032c620002cf565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003977fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000358565b620003a3868362000358565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620003e6620003e0620003da8462000228565b620003bb565b62000228565b9050919050565b6000819050919050565b6200040283620003c5565b6200041a6200041182620003ed565b84845462000365565b825550505050565b600090565b6200043162000422565b6200043e818484620003f7565b505050565b5b8181101562000466576200045a60008262000427565b60018101905062000444565b5050565b601f821115620004b5576200047f8162000333565b6200048a8462000348565b810160208510156200049a578190505b620004b2620004a98562000348565b83018262000443565b50505b505050565b600082821c905092915050565b6000620004da60001984600802620004ba565b1980831691505092915050565b6000620004f58383620004c7565b9150826002028217905092915050565b620005108262000295565b67ffffffffffffffff8111156200052c576200052b620002a0565b5b620005388254620002fe565b620005458282856200046a565b600060209050601f8311600181146200057d576000841562000568578287015190505b620005748582620004e7565b865550620005e4565b601f1984166200058d8662000333565b60005b82811015620005b75784890151825560018201915060208501945060208101905062000590565b86831015620005d75784890151620005d3601f891682620004c7565b8355505b6001600288020188555050505b505050505050565b6124b180620005fc6000396000f3fe60806040526004361061014f5760003560e01c8063715018a6116100b6578063a9059cbb1161006f578063a9059cbb1461048a578063bf17739a146104c7578063d0e30db0146104f2578063dd62ed3e146104fc578063f2fde38b14610539578063fca3b5aa1461056257610156565b8063715018a61461039e5780637acf4892146103b55780638456cb59146103e05780638da5cb5b146103f757806395d89b4114610422578063a457c2d71461044d57610156565b8063313ce56711610108578063313ce5671461027c57806339509351146102a75780633da26428146102e457806340c10f191461030d5780635c975abb1461033657806370a082311461036157610156565b806306fdde0314610158578063095ea7b3146101835780630e0bfb49146101c057806318160ddd146101eb57806323b872dd146102165780632e1a7d4d1461025357610156565b3661015657005b005b34801561016457600080fd5b5061016d61058b565b60405161017a9190611799565b60405180910390f35b34801561018f57600080fd5b506101aa60048036038101906101a59190611854565b61061d565b6040516101b791906118af565b60405180910390f35b3480156101cc57600080fd5b506101d5610640565b6040516101e291906118d9565b60405180910390f35b3480156101f757600080fd5b50610200610646565b60405161020d91906118d9565b60405180910390f35b34801561022257600080fd5b5061023d600480360381019061023891906118f4565b610650565b60405161024a91906118af565b60405180910390f35b34801561025f57600080fd5b5061027a60048036038101906102759190611947565b61067f565b005b34801561028857600080fd5b50610291610701565b60405161029e9190611990565b60405180910390f35b3480156102b357600080fd5b506102ce60048036038101906102c99190611854565b61070a565b6040516102db91906118af565b60405180910390f35b3480156102f057600080fd5b5061030b60048036038101906103069190611947565b610741565b005b34801561031957600080fd5b50610334600480360381019061032f9190611854565b6107d6565b005b34801561034257600080fd5b5061034b61087e565b60405161035891906118af565b60405180910390f35b34801561036d57600080fd5b50610388600480360381019061038391906119ab565b610891565b60405161039591906118d9565b60405180910390f35b3480156103aa57600080fd5b506103b36108d9565b005b3480156103c157600080fd5b506103ca6108ed565b6040516103d791906118af565b60405180910390f35b3480156103ec57600080fd5b506103f561094b565b005b34801561040357600080fd5b5061040c61097f565b60405161041991906119e7565b60405180910390f35b34801561042e57600080fd5b506104376109a9565b6040516104449190611799565b60405180910390f35b34801561045957600080fd5b50610474600480360381019061046f9190611854565b610a3b565b60405161048191906118af565b60405180910390f35b34801561049657600080fd5b506104b160048036038101906104ac9190611854565b610ab2565b6040516104be91906118af565b60405180910390f35b3480156104d357600080fd5b506104dc610ad5565b6040516104e991906118d9565b60405180910390f35b6104fa610aef565b005b34801561050857600080fd5b50610523600480360381019061051e9190611a02565b610b66565b60405161053091906118d9565b60405180910390f35b34801561054557600080fd5b50610560600480360381019061055b91906119ab565b610bed565b005b34801561056e57600080fd5b50610589600480360381019061058491906119ab565b610c70565b005b60606003805461059a90611a71565b80601f01602080910402602001604051908101604052809291908181526020018280546105c690611a71565b80156106135780601f106105e857610100808354040283529160200191610613565b820191906000526020600020905b8154815290600101906020018083116105f657829003601f168201915b5050505050905090565b600080610628610d0c565b9050610635818585610d14565b600191505092915050565b60065481565b6000600254905090565b60008061065b610d0c565b9050610668858285610edd565b610673858585610f69565b60019150509392505050565b6106876108ed565b156106fe5761069633826111df565b6106ad33600654836106a89190611ad1565b6113ac565b3373ffffffffffffffffffffffffffffffffffffffff167ff279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b56882426040516106f5929190611b13565b60405180910390a25b50565b60006006905090565b600080610715610d0c565b90506107368185856107278589610b66565b6107319190611b3c565b610d14565b600191505092915050565b610749611465565b610751610ad5565b811115610793576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078a90611bbc565b60405180910390fd5b806006819055507f80d1756284d10e481d2c449842709d7e09d232e154b94d309b365bb37af6e08981426040516107cb929190611b13565b60405180910390a150565b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610862576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085990611c4e565b60405180910390fd5b61086a6108ed565b1561087a5761087982826114e3565b5b5050565b600760009054906101000a900460ff1681565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6108e1611465565b6108eb6000611639565b565b6000801515600760009054906101000a900460ff16151514610944576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093b90611cba565b60405180910390fd5b6001905090565b610953611465565b600760009054906101000a900460ff1615600760006101000a81548160ff021916908315150217905550565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546109b890611a71565b80601f01602080910402602001604051908101604052809291908181526020018280546109e490611a71565b8015610a315780601f10610a0657610100808354040283529160200191610a31565b820191906000526020600020905b815481529060010190602001808311610a1457829003601f168201915b5050505050905090565b600080610a46610d0c565b90506000610a548286610b66565b905083811015610a99576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a9090611d4c565b60405180910390fd5b610aa68286868403610d14565b60019250505092915050565b600080610abd610d0c565b9050610aca818585610f69565b600191505092915050565b6000610adf610646565b47610aea9190611d9b565b905090565b610af76108ed565b15610b6457610b133360065434610b0e9190611d9b565b6114e3565b3373ffffffffffffffffffffffffffffffffffffffff167f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a153442604051610b5b929190611b13565b60405180910390a25b565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b610bf5611465565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610c64576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5b90611e3e565b60405180910390fd5b610c6d81611639565b50565b610c78611465565b6001600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507f8840db774402019e70ed2f3826ba8a465696423880a3ddc261c1345e334545de8142604051610d01929190611e5e565b60405180910390a150565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d83576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d7a90611ef9565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610df2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610de990611f8b565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610ed091906118d9565b60405180910390a3505050565b6000610ee98484610b66565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610f635781811015610f55576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4c90611ff7565b60405180910390fd5b610f628484848403610d14565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610fd8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fcf90612089565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611047576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161103e9061211b565b60405180910390fd5b6110528383836116ff565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156110d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110cf906121ad565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516111c691906118d9565b60405180910390a36111d9848484611704565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361124e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112459061223f565b60405180910390fd5b61125a826000836116ff565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156112e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112d7906122d1565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600260008282540392505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161139391906118d9565b60405180910390a36113a783600084611704565b505050565b6113b4611465565b60008273ffffffffffffffffffffffffffffffffffffffff16826040516113da90612322565b60006040518083038185875af1925050503d8060008114611417576040519150601f19603f3d011682016040523d82523d6000602084013e61141c565b606091505b5050905080611460576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161145790612383565b60405180910390fd5b505050565b61146d610d0c565b73ffffffffffffffffffffffffffffffffffffffff1661148b61097f565b73ffffffffffffffffffffffffffffffffffffffff16146114e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114d8906123ef565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611552576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115499061245b565b60405180910390fd5b61155e600083836116ff565b80600260008282546115709190611b3c565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161162191906118d9565b60405180910390a361163560008383611704565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611743578082015181840152602081019050611728565b60008484015250505050565b6000601f19601f8301169050919050565b600061176b82611709565b6117758185611714565b9350611785818560208601611725565b61178e8161174f565b840191505092915050565b600060208201905081810360008301526117b38184611760565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006117eb826117c0565b9050919050565b6117fb816117e0565b811461180657600080fd5b50565b600081359050611818816117f2565b92915050565b6000819050919050565b6118318161181e565b811461183c57600080fd5b50565b60008135905061184e81611828565b92915050565b6000806040838503121561186b5761186a6117bb565b5b600061187985828601611809565b925050602061188a8582860161183f565b9150509250929050565b60008115159050919050565b6118a981611894565b82525050565b60006020820190506118c460008301846118a0565b92915050565b6118d38161181e565b82525050565b60006020820190506118ee60008301846118ca565b92915050565b60008060006060848603121561190d5761190c6117bb565b5b600061191b86828701611809565b935050602061192c86828701611809565b925050604061193d8682870161183f565b9150509250925092565b60006020828403121561195d5761195c6117bb565b5b600061196b8482850161183f565b91505092915050565b600060ff82169050919050565b61198a81611974565b82525050565b60006020820190506119a56000830184611981565b92915050565b6000602082840312156119c1576119c06117bb565b5b60006119cf84828501611809565b91505092915050565b6119e1816117e0565b82525050565b60006020820190506119fc60008301846119d8565b92915050565b60008060408385031215611a1957611a186117bb565b5b6000611a2785828601611809565b9250506020611a3885828601611809565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611a8957607f821691505b602082108103611a9c57611a9b611a42565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611adc8261181e565b9150611ae78361181e565b9250828202611af58161181e565b91508282048414831517611b0c57611b0b611aa2565b5b5092915050565b6000604082019050611b2860008301856118ca565b611b3560208301846118ca565b9392505050565b6000611b478261181e565b9150611b528361181e565b9250828201905080821115611b6a57611b69611aa2565b5b92915050565b7f496e76616c6964207377617020726174696f0000000000000000000000000000600082015250565b6000611ba6601283611714565b9150611bb182611b70565b602082019050919050565b60006020820190508181036000830152611bd581611b99565b9050919050565b7f796f7520646f6e2774206861766520617574686f7269747920746f206d696e7460008201527f2e00000000000000000000000000000000000000000000000000000000000000602082015250565b6000611c38602183611714565b9150611c4382611bdc565b604082019050919050565b60006020820190508181036000830152611c6781611c2b565b9050919050565b7f6974277320706175736564000000000000000000000000000000000000000000600082015250565b6000611ca4600b83611714565b9150611caf82611c6e565b602082019050919050565b60006020820190508181036000830152611cd381611c97565b9050919050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000611d36602583611714565b9150611d4182611cda565b604082019050919050565b60006020820190508181036000830152611d6581611d29565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000611da68261181e565b9150611db18361181e565b925082611dc157611dc0611d6c565b5b828204905092915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611e28602683611714565b9150611e3382611dcc565b604082019050919050565b60006020820190508181036000830152611e5781611e1b565b9050919050565b6000604082019050611e7360008301856119d8565b611e8060208301846118ca565b9392505050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000611ee3602483611714565b9150611eee82611e87565b604082019050919050565b60006020820190508181036000830152611f1281611ed6565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000611f75602283611714565b9150611f8082611f19565b604082019050919050565b60006020820190508181036000830152611fa481611f68565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b6000611fe1601d83611714565b9150611fec82611fab565b602082019050919050565b6000602082019050818103600083015261201081611fd4565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b6000612073602583611714565b915061207e82612017565b604082019050919050565b600060208201905081810360008301526120a281612066565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000612105602383611714565b9150612110826120a9565b604082019050919050565b60006020820190508181036000830152612134816120f8565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b6000612197602683611714565b91506121a28261213b565b604082019050919050565b600060208201905081810360008301526121c68161218a565b9050919050565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b6000612229602183611714565b9150612234826121cd565b604082019050919050565b600060208201905081810360008301526122588161221c565b9050919050565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b60006122bb602283611714565b91506122c68261225f565b604082019050919050565b600060208201905081810360008301526122ea816122ae565b9050919050565b600081905092915050565b50565b600061230c6000836122f1565b9150612317826122fc565b600082019050919050565b600061232d826122ff565b9150819050919050565b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b600061236d601483611714565b915061237882612337565b602082019050919050565b6000602082019050818103600083015261239c81612360565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006123d9602083611714565b91506123e4826123a3565b602082019050919050565b60006020820190508181036000830152612408816123cc565b9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6000612445601f83611714565b91506124508261240f565b602082019050919050565b6000602082019050818103600083015261247481612438565b905091905056fea26469706673582212201ef038e617569064e41240b5601601af115fddb9a796356d9739e51404f680f164736f6c63430008110033";

type RewardTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RewardTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RewardToken__factory extends ContractFactory {
  constructor(...args: RewardTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    maxSupply_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RewardToken> {
    return super.deploy(maxSupply_, overrides || {}) as Promise<RewardToken>;
  }
  override getDeployTransaction(
    maxSupply_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(maxSupply_, overrides || {});
  }
  override attach(address: string): RewardToken {
    return super.attach(address) as RewardToken;
  }
  override connect(signer: Signer): RewardToken__factory {
    return super.connect(signer) as RewardToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RewardTokenInterface {
    return new utils.Interface(_abi) as RewardTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RewardToken {
    return new Contract(address, _abi, signerOrProvider) as RewardToken;
  }
}
