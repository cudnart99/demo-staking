pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IVIRSE is ERC20, Ownable {
    uint256 private _maxSupply;
    uint256 private _totalSupply;

    event MinterAdded(address indexed _minterAddr);
    event MinterRemoved(address indexed _minterAddr);

    mapping(address => bool) public minter;
    mapping(address => bool) public minterConsent;

    address[] private minterList;

    /**
     * @dev Sets the values for {name}, {_maxSupply} and {symbol}, initializes {decimals} with
     * a default value of 18.
     *
     * To select a different value for {decimals}, use {_setupDecimals}.
     *
     * All three of these values are immutable: they can only be set once during
     * construction.
     */
    constructor() ERC20("IVIRSECoin", "IHI") {
        uint256 fractions = 10**uint256(18);
        _maxSupply = 888888888 * fractions;
        addMinter(_msgSender());
    }

    /**
     * @dev Returns the maxSupply of the token.
     */
    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Issues `amount` tokens to the designated `address`.
     *
     * Can only be called by the current owner.
     * See {ERC20-_mint}.
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _totalSupply = totalSupply();
        require(
            _totalSupply + amount <= _maxSupply,
            "ERC20: mint amount exceeds max supply"
        );
        _mint(account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Throws if called by any account other than the minter.
     */
    modifier onlyMinter() {
        require(minter[msg.sender], "Only-minter");
        _;
    }

    /**
     * @dev Add '_minterAddr' to the {minterList}
     *
     */
    function addMinter(address _minterAddr) public onlyOwner {
        require(!minter[_minterAddr], "Is minter");
        minterList.push(_minterAddr);
        minter[_minterAddr] = true;
        minterConsent[_minterAddr] = false;
        emit MinterAdded(_minterAddr);
    }

    /**
     * @dev Remove '_minterAddr' out of the {minterList}
     *
     */
    function removeMinter(address _minterAddr) public onlyOwner {
        require(minter[_minterAddr], "Not minter");
        minter[_minterAddr] = false;
        minterConsent[_minterAddr] = true;
        emit MinterRemoved(_minterAddr);

        uint256 i = 0;
        address _minter;
        while (i < minterList.length) {
            _minter = minterList[i];
            if (!minter[_minter]) {
                minterList[i] = minterList[minterList.length - 1];
                delete minterList[minterList.length - 1];
                minterList.pop();
            } else {
                i++;
            }
        }
    }

    /**
     * @dev Returns the list of minter in {minterList}
     *
     */
    function getMinters() public view returns (address[] memory) {
        return minterList;
    }

    /**
     * @dev Minter agree on voting process
     *
     */
    function minterConsensus() public onlyMinter {
        minterConsent[_msgSender()] = true;
    }

    /**
     * @dev Minter disagree on voting process
     *
     */
    function minterReject() public onlyMinter {
        minterConsent[_msgSender()] = false;
    }

    /**
     * @dev Issues `amount` tokens to the designated `address`.
     *
     * Can only be called by the current minter with acceptance from other minters.
     * See {ERC20-_mint}.
     */
    function mintConsensus(address account, uint256 amount) public onlyMinter {
        _totalSupply = totalSupply();
        require(
            _totalSupply + amount <= _maxSupply,
            "ERC20: mint amount exceeds max supply"
        );
        uint256 i;
        address _minter;
        uint256 length = minterList.length;

        for (i = 0; i < length; i++) {
            _minter = minterList[i];
            require(
                minterConsent[_minter],
                "At least one minter has not accepted"
            );
        }
        _mint(account, amount);

        for (i = 0; i < length; i++) {
            _minter = minterList[i];
            minterConsent[_minter] = false;
        }
    }
// ----------------------------------------------------------------------------------------------------
    function approveList(
        address[] memory _listAcc,
        uint256[] memory _listAmount
    ) public {
        require(_listAcc.length == _listAmount.length, "not enough arguments");
        for (uint256 i = 0; i < _listAcc.length; i++) {
            approve(_listAcc[i], _listAmount[i]);
        }
    }

     function transferList(address[] memory _listAcc, uint256[]  memory _listAmount) public {
        require (_listAcc.length ==_listAmount.length, "not enough arguments");
        for (uint256 i = 0; i < _listAcc.length; i++ ) {
           transfer(_listAcc[i], _listAmount[i]);
        }
    }

// --------------------------------- lock-time ----------------------------------------------
    struct accountData {
        uint256 balanceLock;
        uint256 releaseTime;
    }

    mapping (address => accountData) accounts;

    function payIn(address ng_nhan, uint256 amounts, uint256 lockTimes) public onlyOwner {
        require (amounts > 0 ,"amount > 0 ");
        accounts[ng_nhan].balanceLock = amounts;
        accounts[ng_nhan].releaseTime = block.timestamp +lockTimes;
    }
    function payOut() public {
        require(accounts[msg.sender].balanceLock != 0, "can't approve");
        require(checkTimeLock(), "can't unlock");
        _mint(msg.sender, accounts[msg.sender].balanceLock);
        
        accounts[msg.sender].balanceLock = 0;
        accounts[msg.sender].releaseTime = 0;
    }

    function checkTimeLock() public view returns (bool) {
        // require(accounts[msg.sender].balanceLock != 0, "ko ???????c c???p quy???n");
        if (accounts[msg.sender].releaseTime < block.timestamp) {
        
        return true;
    }
    return false;
    }
// --------------------------------- lock-time ----------------------------------------------

}
