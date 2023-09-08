// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RewardToken.sol";
import "./RewardNft.sol";
import "hardhat/console.sol";

contract Bank is Ownable {
    address rewardToken;
    address rewardNft;
    bool paused;

    struct BankAccount {
        uint256 balance;
        uint256 claimedAt;
    }

    uint256 public potMoney;
    mapping(address => BankAccount) public deposited;
    address[] depositedUserLists;
    mapping(address => bool) depositChecker;

    mapping(address => BankAccount) public staked;
    address[] stakedUserLists;
    mapping(address => bool) stakeChecker;

    mapping(address => bool) public blackLists;

    mapping(address => bool) public nftHolders;

    uint256 public leadersCount;

    uint256 public untilSidecar;

    string[] public nftTokenURIBundle = [
        "ipfs://sha256hashValue/sample1.json",
        "ipfs://sha256hashValue/sample2.json",
        "ipfs://sha256hashValue/sample3.json"
    ];
    uint public indexCountForNftMint = 0;

    // 모든 이벤트 epoch time 추가
    event Deposit(address indexed user, uint256 amount, uint epoch);
    event Withdraw(address indexed user, uint256 amount, uint epoch);
    event ClaimInterest(
        address indexed user,
        uint256 reward,
        uint256 canSend,
        uint epoch
    );

    event Stake(address indexed user, uint256 amount, uint epoch);
    event Unstake(address indexed user, uint256 amount, uint epoch);
    event ClaimReward(address indexed user, uint256 reward, uint epoch);

    constructor(address rewardToken_, address rewardNft_) {
        rewardToken = rewardToken_;
        rewardNft = rewardNft_;
    }

    /**************
     * CORE FUNCS *
     **************/

    /*
    - Amount(deposit balance)에 대해 초당 발생하는 이자 값을 return
    - **case1) amount < 100 * 1e18
    - (0, 100%)와 (100 * 1e18, 50%)를 잇는 1차 함수에 의한 이율
        - 다음 포인트를 지난다. ⇒ (50 * 1e18, 0.75)
        50 * 1e18 개를 deposit 했을 경우, 75%의 이율을 얻는다고 할 수 있음
    
    - **case2) amount ≥ 100 * 1e18**
    - 항상 연 50%의 이율
    - 이자는 초 단위로 발생하며, 소수점 이하로 절삭되는 부분은 오차로 감안
    - 한 유저의 이자를 계산할 경우, 유저가 투자한 총 deposit balance에 대해서 이자 축적을 실시
    - 유저가 ‘시각 100초’에 50, ‘시각 200초’에 30을 투자했을 경우
        - 100초~200초: 50에 대한 이자 축적
        - 200초~현재: 80에 대한 이자 축적
    
    - 예시)
    - calcInterestPerSecond(100000000000000000000) = 1585489599188
     */
    function calcInterestPerSecond(
        uint256 amount
    ) public pure returns (uint256) {
        uint AnnualInterestAmount;
        /* 
        case1)        
        기울기 = f(x + h) - f(x)/ (x+h) - x -> x축 기준 x부터 x+h까지의 선분에서 y증가분/x증가분
        interest의 1차 함수의 기울기 grad == 50 - 100 / (100 * 1e18) - 0
        y = grad*x + 100. ** y절편 == 100, x는 deposit 수량, y는 이자율을 의미 
        */
        if (amount < 100 * 1e18) {
            int256 funcGrad = int(50 - 100) / (100 * 1e18);
            int256 AnnualInterestRate = int(funcGrad) * int(amount) + 100; // -> ex) 65, 75
            AnnualInterestAmount = (amount * uint(AnnualInterestRate)) / 100;
        }
        // case2)
        else if (amount >= 100 * 1e18) {
            AnnualInterestAmount = amount / 2;
        }

        uint interestAmountPerSec = AnnualInterestAmount / (60 * 60 * 24 * 365); // x/31536000
        //console.log("interestAmountPerSec: ", interestAmountPerSec);
        return interestAmountPerSec;
    }

    /* 
    ETH 예치. claimInterest로 ETH 이자 수령. deposit 후 stake하면 ERC20 토큰으로 이자 지급.
    - 맡긴 **ETH**의 개수, 예치한 기간에 따라 얻게되는 이자(interest)의 양 변동됨
    - 쌓인 이자를 인출하는 방법으로는 claimReward 함수 이용 가능 
    - deposit시 유저가 A개의 **ETH**를 맡길 경우, deposited[USER_ADDRESS].balance는 A만큼증가

    - **deposit에 따른 rewardNft 보상**
    - deposit 한 유저가 총 10명 이상 있을 때(지금 deposit을 하고 있는 유저를 포함하여),
    deposit 액수 1위 유저에게 rewardNft를 mint해준다.
    - 이 때 해당 유저가 이미 rewardNft를 가지고 있따면 mint하지 않는다.
    - 예시)
        - 9명의 유저가 deposit을 하고 있음. user1, user2, user3, …, user9.
        - user10이 deposit을 하며, deposit 액수 순위 10위에 랭크될 경우,
            - user1에게 rewardNft가 지급됨
        - user10이 deposit을 하며, deposit 액수 순위 1위에 랭크될 경우,
            - user10에게 rewardNft가 지급됨
    */
    function deposit() external payable {
        //Pause check
        if (isNotPaused() && block.timestamp > untilSidecar) {
            if (!depositChecker[msg.sender]) {
                depositChecker[msg.sender] = true;
                depositedUserLists.push(msg.sender);
            }
            claimInterest(msg.sender);
            deposited[msg.sender].balance += msg.value;
            deposited[msg.sender].claimedAt = block.timestamp;
            emit Deposit(msg.sender, msg.value, block.timestamp);
            if (depositedUserLists.length >= 10) {
                //1순위 유저 조회
                address[] memory rankOneUserArr;
                (, rankOneUserArr) = sortDescending();
                address rankOneUser = rankOneUserArr[0];

                //1순위 유저가 nft를 발급받지 않은 상황이라면(이미 민팅받았는지 체크)
                if (!nftHolders[rankOneUser]) {
                    /* nft를 발급해주는데 nft 목록(tokenURI)은 서비스 운영사에서 사전에 등록해놓았다고 가정한다. 
                    편의상 3개의 nft 데이터를 여러 유저들에게 중복하여 발급하도록 한다. 
                    */
                    RewardNft(rewardNft).mint(
                        msg.sender,
                        nftTokenURIBundle[indexCountForNftMint]
                    );
                    nftHolders[rankOneUser] = true;
                    indexCountForNftMint++;
                    indexCountForNftMint = indexCountForNftMint % 3;
                }
            }
        }
    }

    /* ETH 인출
    - withdraw시 유저가 B개를 인출할 경우, deposited[USER_ADDRESS].balance가 B만큼 감소, 유저는 B개의 **ETH**를 수령
    - 유저가 모든 돈을 인출했을 경우 claimedAt은 0으로 초기화되도록 할 것
    */
    function withdraw(uint256 amount) external {
        if (
            isNotPaused() &&
            blackLists[msg.sender] == false &&
            block.timestamp > untilSidecar
        ) {
            claimInterest(msg.sender);
            deposited[msg.sender].balance -= amount;
            emit Withdraw(msg.sender, amount, block.timestamp);
            if (deposited[msg.sender].balance == 0) {
                deposited[msg.sender].claimedAt = 0;
            }
        }
    }

    /*
    - 유저가 deposit한 후 쌓이게 된 이자를 찾는 방법이며, 실행 시 유저는 쌓인 자신의 모든 이자를 흭득
    - 이자는 calcInterestPerSecond 함수의 계산 결과만큼 축적
    - 가령 유저가 ‘시각 200초’에 100 * 1e18개를 deposit 했고, ‘시각 250초’에 claimInterest를 실행할 경우,
        - calcInterestPerSecond(100*1e18) * 50 만큼의 이자 수령
        - 260초에 다시한번 claimInterest를 실행 한다면, calcInterestPerSecond(100*1e18) * 10 의 이자 수령
    - 이자는 **ETH**로 수령
    - 특수 조건
        - 유저가 deposit, withdraw 진행 시 claimInterest가 자동으로 처리되도록 구현 필요
        - 즉 deposit, withdraw 함수의 가장 첫 실행 부분에 이미 claimInterest가 내장되어 있는 구조로 구현
        - 가령 유저가 ‘시각 200초’에 100 * 1e18개를 deposit 했고, ‘시각 250초’에 deposit을 실행할 경우에도, 지난 50초 동안의 100 * 1e18 예치 물량에 해당하는 이자가 유저에게 자동으로 지급되어야 함
        - 유저의 deposit balance가 0.01개(uint256으로는 1e16) 미만일 경우에는 interest를 0개 지급 
        (실제로 이자를 지급한 것처럼 로직이 실행되나, 0개로 절삭된 것이라 볼 수 있음)
        구현 방식 -> 첫번째 deposit에는 아무런 이자 지급이 없고 이후 deposit마다 지급됨. deposit시 claimedAt 참고 필요. 초단위 이자 산정 위해서.. 
    */
    function claimInterest(address user) public {
        if (isNotPaused() && block.timestamp > untilSidecar) {
            uint interestAmountPerSec = calcInterestPerSecond(
                deposited[user].balance
            );
            uint totalInterestAmount = interestAmountPerSec *
                (block.timestamp - deposited[user].claimedAt); // / 1e18; // ethAmount
            //console.log("totalInterestAmount: ", totalInterestAmount);
            uint canSend = ethTransfer(
                payable(user),
                totalInterestAmount,
                true
            );
            //deposited[user].claimedAt = block.timestamp;
            emit ClaimInterest(
                user,
                totalInterestAmount,
                canSend,
                block.timestamp
            );
        }
    }

    /*
    - 유저가 deposit한 물량에 대해서 추가적으로 ‘적금’할 수 있도록 하는 기능
    - 현재 유저의 deposit 물량이 A라면 (즉 deposited[USER_ADDRESS].blance=A), 최대 A만큼 stake 가능
    - 가령 유저의 deposit 물량이 100이고, 유저가 30개의 물량에 대해 stake를 실행할 시
        - deposit 물량은 70, stake 물량은 30
        - staked[USER_ADDRESS].balance에 30이 기록
    ** minimum staking 수량 설정 (1e16)
    */
    function stake(uint256 amount) external {
        if (isNotPaused()) {
            require(amount >= 1e16, "insufficient amount");
            claimReward(msg.sender);
            staked[msg.sender].claimedAt = block.timestamp;
            deposited[msg.sender].balance -= amount;
            staked[msg.sender].balance += amount;
            emit Stake(msg.sender, amount, block.timestamp);
        }
    }

    /*
    - 유저가 적금(stake)한 물량에 대해, 다시 적금을 취소할 수 있는 기능
    - 예시
        - deposited[USER_ADDRESS].balance = 70
        staked[USER_ADDRESS].balance = 30
        - 만약 여기서 15를 unstake 한다면, 아래와 같이 상태가 변경
        - deposited[USER_ADDRESS].balance = 85
        staked[USER_ADDRESS].balance = 15
    - 적금의 경우, 유저가 적금의 리워드를 찾아간 적이 있다면(즉 claimReward 한 적이 있다면),
        - 리워드를 찾아간 시각으로부터 정확히 24시간 동안은 unstake 실행 불가(revert)
    */
    function unstake(uint256 amount) external {
        // implements here
        if (isNotPaused()) {
            require(
                staked[msg.sender].claimedAt + (60 * 60 * 24) < block.timestamp,
                "you can't unstake within 1day after you earn a reward"
            );
            claimReward(msg.sender);
            deposited[msg.sender].balance += amount;
            staked[msg.sender].balance -= amount;
            emit Unstake(msg.sender, amount, block.timestamp);
        }
    }

    /*
    - 유저가 적금(stake)한 양에 리워드가 추가되며, 리워드는 앞서 제작한 RewardToken을 mint하여 제공
    - 리워드의 양은 stake 물량의 연 200% 규모이나 decimal에 의한 차이점을 아래 예시에서 확인할 것
        - 만약 유저가 100*1e18를 stake 하였고, 1년이 경과하였다면 200*1e6개의 rewardToken을 수령
        - 만약 유저가 100*1e18를 stake 하였고, 0.5년이 경과하였다면 100*1e6개의 rewardToken을 수령
        - 유저가 stake하는 단위는 decimal 18 단위이나, reward token의 경우 decimal 6 단위라는 것을 확인할 것
        - 리워드는 초 단위로 계산
    - 특수 조건
        - 유저가 stake, unstake 할 때도, claimReward가 자동으로 처리되도록 구현 필요
        - stake, unstake 함수의 가장 첫 실행 부분에 이미 claimReward가 내장되어있는 구조로 구현
        - deposit, withdraw시 claimInterest가 자동으로 동작하는 것과 동일 원리
        - 유저의 staked balance가 0.01개(uint256으로는 1e16) 미만일 경우에는 reward를 0개 지급 
        (실제로 리워드를 지급한 것처럼 로직이 실행되나, 0개로 절삭된 것이라 볼 수 있음)
    */
    function claimReward(address user) public {
        uint stakedEth = staked[user].balance; // ex) stakedEth = 1 * 1e16
        //console.log("stakedEth: ", stakedEth);
        uint annualInterestAmount = (2 * stakedEth) / 1e12;
        //console.log("annualInterestAmount: ", annualInterestAmount);
        uint interestAmountPerSec = annualInterestAmount / (60 * 60 * 24 * 365);
        //console.log("interestAmountPerSec: ", interestAmountPerSec);
        uint totalInterestAmount = interestAmountPerSec *
            (block.timestamp - staked[user].claimedAt);
        //console.log("totalInterestAmount: ", totalInterestAmount);

        if (isNotPaused()) {
            RewardToken(payable(rewardToken)).mint(user, totalInterestAmount);
            emit ClaimReward(user, totalInterestAmount, block.timestamp);
        }
    }

    /*
    - **ETH**를 넣고 potMoney가 증가하도록 구현
    - 함수 실행자가 100 **ETH**를 넣었다면 potMoney는 100이 증가
    - 이자는 **ETH**로 지급
    - 초기에는 컨트랙트가 가진 **ETH**가 없어 유저에게 이자 지급 불가하며, 이 때 관리자가 수동으로 **ETH**를 컨트랙트에 공급해야 하며 이 함수가 depositPotMoney
    - 유저가 얻는 intrest의 **ETH** 이자는 potMoney 내에서만 지급 될 수 있도록 제한 필요
    - 가령 유저가 흭득할 수 있는 이자가 100이고, 현재 potMoney가 50이라면, 유저는 50에 대해서만 획득 가능
        - event ClaimIntrest를 살펴보면 존재하는 canSend가 실제로 유저가 얻어가는 50을 의미
        - 좌측의 intrest에는 100이 기록
        - 이 때 potMoney는 50이 줄어 0으로 변경
        - 유저는 50의 이자를 손해보지만, 이에 대해서 보상 수령 불가

        ** ethTransfer() 참고
    */
    function depositPotMoney() external payable {
        // implements here
        potMoney += msg.value;
    }

    /**************
     * VIEW FUNCS *
     **************/

    // deposit한 유저들의 순위를 매겼을 때, 해당 user가 bottom 등 수 이내인지 확인
    function checkLeaderRankIn(
        address user,
        uint256 bottom
    ) external view returns (bool) {
        uint[] memory userRankBalances;
        address[] memory userRankAddresses;
        (userRankBalances, userRankAddresses) = sortDescending();
        if (deposited[user].balance >= userRankBalances[bottom - 1]) {
            //arr[0]이 1순위이므로 bottom-1로 순위 계산을 처리한다.
            return true;
        }
    }

    /*
    - deposit 수량 순위 topN 명을 출력
    - 누적 deposit 양, deposit 기록을 기준으로 순위를 집계하는 것이 아닌 실제로 현재 deposit 한 수량을 가지고 순위를 구함
    - 유저 세명이 다음과 같이 예치했다면 userA 100, user B 50, user C 30, top3는 userA, userB, userC가 될 것
        - 이 때 userA가 80을 withdraw하면 3순위로 변경됨
    
    - deposit 수량 순으로 내림차순 정렬되어 있어야 하며, 같은 수량을 가진 유저들의 순위는 자율 구현
    - address[] memory users_
        - topN명의 usre address 목록
    - uint256[] memory amounts_
        - topN명의 usre deposit 수량 리스트
    - topN 명을 지원하는 수준에 따라 점수가 차등 배정
        - top 10명을 올바르게 보여줄 경우
        - top 32명을 올바르게 보여줄 경우
        - top 128명을 올바르게 보여줄 경우
        - top 256명을 올바르게 보여줄 경우
    */
    function showLeaders(
        uint256 topN
    )
        external
        view
        returns (address[] memory users_, uint256[] memory amounts_)
    {
        require(topN <= DepositUserNum(), "out of range");

        address[] memory userRankAddresses;
        uint[] memory userRankBalances;
        (userRankBalances, userRankAddresses) = sortDescending();
        // 모두 가져오는 요청이면 slicing용 재복사 없이 바로 리턴
        if (topN == DepositUserNum()) {
            users_ = userRankAddresses;
            amounts_ = userRankBalances;
        } else {
            users_ = new address[](topN);
            amounts_ = new uint256[](topN);
            for (uint i = 0; i < topN; i++) {
                users_[i] = userRankAddresses[i];
                amounts_[i] = userRankBalances[i];
            }
        }
        return (users_, amounts_);
    }

    function sortDescending()
        public
        view
        returns (
            uint[] memory depositedBalancesArr,
            address[] memory depositedUsersArr
        )
    {
        depositedUsersArr = depositedUserLists;
        depositedBalancesArr = new uint[](depositedUsersArr.length);

        // deposit한 유저들의 주소와 수량을 세팅한다
        for (uint i = 0; i < depositedUsersArr.length; i++) {
            address currentUser = depositedUsersArr[i];
            depositedBalancesArr[i] = deposited[currentUser].balance;
        }

        // 내림차순으로 정렬한다
        uint length = depositedBalancesArr.length;
        for (uint i = 1; i < length; i++) {
            uint key = depositedBalancesArr[i];
            int j = int(i) - 1;
            while ((int(j) >= 0) && (depositedBalancesArr[uint(j)] < key)) {
                depositedBalancesArr[uint(j + 1)] = depositedBalancesArr[
                    uint(j)
                ];
                address tempAddr = depositedUsersArr[uint(j + 1)];
                depositedUsersArr[uint(j + 1)] = depositedUsersArr[uint(j)];
                depositedUsersArr[uint(j)] = tempAddr;
                j--;
            }
            depositedBalancesArr[uint(j + 1)] = key;
        }
        return (depositedBalancesArr, depositedUsersArr);
    }

    // 유저가 depoist한 수량, stake한 수량 반환
    function getUserBalance(
        address user
    ) external view returns (uint256 depositBalance, uint256 stakeBalance) {
        depositBalance = deposited[user].balance;
        stakeBalance = staked[user].balance;

        return (depositBalance, stakeBalance);
    }

    /**********
     * ADMINS *
     **********/

    /*
    - 관리자 전용 함, ownable을 구현하여 onlyOwner를 적용
    - 관리자는 직접 potMoney를 인출해 ETH를 흭득
    */
    function withdrawPotMoney(uint256 amount) external onlyOwner {
        ethTransfer(payable(msg.sender), amount, false);
    }

    // 이자 지급은 potMoney 범위 내에서만
    function ethTransfer(
        address payable _to,
        uint _amount,
        bool isInterestPayment
    ) internal returns (uint) {
        if (isInterestPayment) {
            //potMoney가 이자 지급액보다 적으면 eth 지급액, potMoney 차감액을 변경한다
            if (potMoney < _amount) {
                _amount = potMoney;
            }
            potMoney -= _amount;
            // Note that "to" is declared as payable
        }
        (bool success, ) = _to.call{value: _amount}("");
        if (success) {
            return _amount; // 지급액 리턴
        }
    }

    /*
    - 관리자 전용 함수 ownable을 구현하여 onlyOwner를 적용
    - sidecar를 N초 동안 발동(최대 3시간)
    - sidecar가 발동되는 시각은 untilSidecar에 기록
    - 즉 untilSidecar까지 sidecar가 발동되는 것이며, 단위는 timestamp(seconds)
    - sidecar가 발동되면, deposit, withdraw, claimInterest 함수는 실행 불가
    */
    function invokeSidecar(uint256 secs) external onlyOwner {
        // implements here
        // 3hours = 60 sec * 60 * 3
        uint maxSec = 60 * 60 * 3;
        require(secs < maxSec, "you need to set secs within 3hours");
        untilSidecar = block.timestamp + secs;
    }

    /*
    - 관리자 전용 함수, ownable을 구현하여 onlyOwner를 적용
    - black list로 지정된 유저는 withdraw 불가
    */
    function setBlacklist(address user, bool status) external onlyOwner {
        blackLists[user] = status;
    }

    /*
    - 관리자 전용 함수,ownable을 구현하여 onlyOwner를 적용
    - pause 발동 시, 다음 함수들은 실행 불가
    - depoist, withdraw, claimIntrest, stake, unstake, claimReward (notion에 claimInterest라고 표기되어있으나 Reward라고 인지하겠습니다)
    - pause를 다시 실행할 시 unpause  (토글방식)
    */
    function pause() external onlyOwner {
        paused = !paused;
    }

    function isNotPaused() public view returns (bool) {
        require(paused == false, "it's paused");
        return true;
    }

    function DepositUserNum() public view returns (uint) {
        return depositedUserLists.length;
    }
}
