// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Bank.sol";

contract Router {
    address public bank;

    constructor(address bank_) {
        bank = bank_;
    }

    /*
    - Bank의 showLeaders를 page 별로 출력해주는 함수
    - page size는 10, 즉 한 페이지에 10개의 아이템이 출력
    - page는 1번 부터 시작
    - 2 page의 경우, rank 11~20까지가 출력
    - rank25번이 마지막이고 3 page를 요청한다면, 21~25가 출력
    */
    function getUsers(
        uint256 page
    )
        external
        view
        returns (address[] memory users_, uint256[] memory amounts_)
    {
        //1페이지당 보여줄 유저수
        uint itemsPerPage = 10;

        Bank bankContract = Bank(payable(bank));
        (
            address[] memory userLists,
            uint256[] memory amountLists
        ) = bankContract.showLeaders(bankContract.DepositUserNum());

        // 전체 리더 수
        uint totalLeaders = userLists.length;

        /*
        1페이지 -> userLists[0] ~ userLists[9]
        2페이지 -> userLists[10] ~ userLists[19]
        3페이지 -> userLists[20] ~ userLists[29]
        */
        uint startIdx = (page - 1) * itemsPerPage;

        // 요청 페이지가 마지막인지 아닌지 체크하여 리턴 배열 수 결정
        uint itemCount = totalLeaders - startIdx;
        if (itemCount > itemsPerPage) {
            itemCount = itemsPerPage;
        }

         users_ = new address[](itemCount); // Initialize the users_ array
        amounts_ = new uint256[](itemCount); // Initialize the amounts_ array

        for (uint i = 0; i < itemCount; i++) {
            users_[i] = userLists[startIdx];
            amounts_[i] = amountLists[startIdx];
            startIdx++;
        }

        return (users_, amounts_);
    }

    /*
    - user 주소를 넣어, 해당 유저의 여러 정보를 동시에 얻는 기능
    - 이 때 options는 abi.encode(showDeposit, showStake) 되어 호출
    - ex) abi.encode(false, true)
    */
    function getUserInfo(
        address user,
        bytes calldata options
    )
        external
        view
        returns (
            uint256 depositBalance,
            uint256 depositClaimedAt,
            uint256 stakeBalance,
            uint256 stakeClaimedAt,
            bool isBlackUser,
            uint256 blockNumber
        )
    {
        // implements here
        //
        // [info] options에 대한 정보
        // options = abi.encode(showDeposit, showStake)
        // showDeposit: boolean
        // showStake: boolean
        // 위 규격에 맞춰 options를 decode 한 후 user 정보를 돌려줄 것
        (bool showDeposit, bool showStake) = abi.decode(options, (bool, bool));

        Bank bankContract = Bank(bank);

        if (showDeposit) {
            (uint256 depositAmount, uint256 depositClaimTime) = bankContract
                .deposited(user);

            depositBalance = depositAmount;
            depositClaimedAt = depositClaimTime;
        }

        if (showStake) {
            (uint256 stakeAmount, uint256 stakeClaimTime) = bankContract.staked(
                user
            );
            stakeBalance = stakeAmount;
            stakeClaimedAt = stakeClaimTime;
        }
        isBlackUser = Bank(bank).blackLists(user);
        blockNumber = block.number;
        return (
            depositBalance,
            depositClaimedAt,
            stakeBalance,
            stakeClaimedAt,
            isBlackUser,
            blockNumber
        );
    }

    function encode(bool showDeposit, bool showStake) public returns(bytes memory){
       return abi.encode(showDeposit, showStake);
    }
}
