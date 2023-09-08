// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/*
 * Notice
 
 * name = You are a VIP
 * symbol = VIP
 
 * tokenId는 0에서 시작하여 매 mint마다 1씩 증가
 * 관리자 전용 함수,  표준 Ownable을 구현하여 onlyOwner를 적용

 * Ownable 구현시
    - owner() 조회 가능 해야함
    - transferOwnership(address) 가능 해야함
    - onlyOnwer modifier를 사용 가능해야함
 */
contract RewardNft is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public bankContract;

    constructor() ERC721("You are a VIP", "VIP") {}

    // tokenURI example) "https://game.example/item-id-8u5h2m.json"
    function mint(
        address to,
        string memory tokenURI
    ) public _onlyOwner returns (uint256 newNFTId) {
        newNFTId = _tokenIds.current();
        _mint(to, newNFTId);
        _setTokenURI(newNFTId, tokenURI);

        _tokenIds.increment();
        return newNFTId;
    }

    modifier _onlyOwner() {
        require(
            msg.sender == super.owner() || msg.sender == bankContract,
            "Not authorized"
        );
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    function setBankContract(address addr) public _onlyOwner {
        bankContract = addr;
    }
}
