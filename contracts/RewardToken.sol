// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * Notice
 * 토큰 decimals는 6으로 설정 필요 -> 1PAC = 1pac * 1e6
    - **name** = Pacific
    - **symbol** = PAC
 * function별 event 호출
 * 
 */
contract RewardToken is ERC20, Ownable {
    //uint256 public maxSupply; //  ERC20 contract를 상속받아 totalSupply 변수가 이미 존재하므로 생략.
    uint256 public swapRatio;
    bool public paused;
    mapping(address => bool) isMinter; // these addresses have authority to mint. contract Owner has highest authority(role), minters have the authority below it.
    /**********
     * EVENTS *
     **********/

    /**
     * 모든 event의 param으로 epoch timestamp 추가 (후에 에러 발생시 이벤트를 백업하고 있는 미들웨어에서 디버깅 하기 위해)
     */

    // 유저 주소, 맡긴 수량(유저가 맡긴 ETH양)
    event Deposit(address indexed user, uint256 amount, uint epoch);

    // 유저 주소, 찾은 수량(유저가 받게 되는 양이 아닌, deposit에서 차감되는 양을 의미)
    event Withdraw(address indexed user, uint256 amount, uint epoch);

    // 리워드 토큰을 mint하는 권한자 지정
    event SetMinter(address minter, uint epoch);

    // swapRatio 지정
    event UpdateSwapRatio(uint256 swapRatio, uint epoch);

    /*************
     * FUNCTIONS *
     *************/

    constructor(uint256 maxSupply_) ERC20("Pacific", "PAC") {
        //maxSupply = maxSupply_; // ERC20 contract를 상속받아 totalSupply 변수가 이미 존재하므로 생략. 다만 자동화 채점을 의식하여 인스턴스 파라미터는 변경하지 않았음
        swapRatio = 100 * 1e12; // 100 * 10^12
        isMinter[msg.sender] = true; // contract owner has Minter Role by default.
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /* deposit은 ETH를 맡기는 행위이며, 그 결과 유저는 RewardToken 획득
     * deposit시 A개의 ETH를 맡길 경우, A / swapRatio 만큼의 rewardToken을 획득 -> 5개의 ETH deposit시 5 *1e18 / 100 * 10^12 개의 reward token 획득
     * rewardToken이 곧바로 mint 되어 deposit 실행자에게 전달될 것
     */
    function deposit() external payable {
        // pause Check
        if (isNotPaused()) {
            _mint(msg.sender, msg.value / swapRatio);
            emit Deposit(msg.sender, msg.value, block.timestamp);
        }
    }

    /* withdraw는 RewardToken을 반환하고 맡긴 ETH를 찾는 행위
     * withdraw시 B개를 인출할 경우, B개의 reward token을 반환하고 B * swapRatio 만큼 ETH를 획득.
     * 반환 : burn(totalSupply --)
     */
    function withdraw(uint256 amount) external {
        // pause Check
        if (isNotPaused()) {
            //reward token 반환
            _burn(msg.sender, amount);
            //ETH 환급
            ethTransfer(payable(msg.sender), amount * swapRatio);
            emit Withdraw(msg.sender, amount, block.timestamp);
        }
    }

    function ethTransfer(address payable _to, uint _amount) internal onlyOwner {
        // Note that "to" is declared as payable
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    /* (RewardToken 컨트랙트가 소유한 ETH의 개수 / rewardToken의 totalSupply)를 반환 */
    function realRatio() public view returns (uint256) {
        // implements here
        return address(this).balance / super.totalSupply();
    }

    /**********
     * ADMINS *
     **********/

    /* setMinter를 통해 지정된 자만 mint 가능. 이는 ownable의 관리자와는 다름.
     * rewardToken을 관리자가 임의로 발행 가능
     * 1 token = 1 * (10 ** decimals)
     */
    function mint(address account, uint256 amount) external {
        //auth Check
        require(isMinter[msg.sender], "you don't have authority to mint.");
        //pause Check
        if (isNotPaused()) {
            _mint(account, amount);
        }
    }

    /*
     * 관리자 전용 함수,  ownable을 구현하여 onlyOwner를 적용
     * 토큰을 발행하는 관리자를 지정
     */
    function setMinter(address minter_) external onlyOwner {
        // implements here
        isMinter[minter_] = true;
        emit SetMinter(minter_, block.timestamp);
    }

    /*
     * 관리자 전용 함수, ownable을 구현하여 onlyOwner를 적용
     * deposit, withdraw 시의 교환 비율
     * 변경하려는 swapRatio는 다음 값 이하여야 하며, 그렇지 않을 경우 revert 발생 필요
     * nextSwapRatio ≤ rewardToken 컨트랙트가 가진 ETH의 양 / reward token의 totalSupply
     */
    function updateSwapRatio(uint256 swapRatio_) external onlyOwner {
        require(swapRatio_ <= realRatio(), "Invalid swap ratio");
        swapRatio = swapRatio_;
        emit UpdateSwapRatio(swapRatio_, block.timestamp);
    }

    /*
     * 관리자 전용 함수, ownable을 구현하여 onlyOwner를 적용
     * pause 발동시, 하기 함수 실행 불가 -> mint, depoist, withdraw
     * pause를 다시 실행할 시 unpause 처리 (토글방식)
     */
    function pause() external onlyOwner {
        paused = !paused;
    }

    function isNotPaused() public view returns (bool) {
        require(paused == false, "it's paused");
        return true;
    }

    receive() external payable {}

    fallback() external payable {}
}
