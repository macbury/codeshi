pragma experimental ABIEncoderV2;
import "hardhat/console.sol";
// contracts/CodeshiToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

struct Dividend {
  address target;
  uint256 amount;
}

struct Order {
  string productId;
  uint256 nonce;
  uint block;
}

//https://forum.openzeppelin.com/t/enabling-an-erc20-and-a-contract-receiving-the-erc20-token-for-gas-station-network/1555/3
contract CodeshiToken is ERC20PresetMinterPauserUpgradeable {
  using ECDSA for bytes32;

  uint tweetsUrlCount;
  mapping(uint => string) tweetsUrl;
  mapping(uint256 => bool) usedNonces;
  mapping(address => Order[]) orders;

  event NewOrder(address indexed _from, string receiptId);
  
  function getLatestTweet() public view returns(string memory tweetUrl){
    return tweetsUrl[tweetsUrlCount - 1];
  }

  function setup() public initializer {
    __ERC20PresetMinterPauser_init("Codeshi", "CX");
    _setupDecimals(0);
    tweetsUrlCount = 0;
  }

  function dividends(Dividend[] memory divs, string memory tweetUrl) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to mint");

    for (uint i = 0; i < divs.length; i++) {
      Dividend memory div = divs[i];

      _mint(div.target, div.amount);
    }

    tweetsUrl[tweetsUrlCount] = tweetUrl;
    tweetsUrlCount++;
  }

  function getOrdersFor(address client) public view returns(Order[] memory out) {
    return orders[client];
  }

  function getMyOrders() public view returns(Order[] memory out) {
    return getOrdersFor(_msgSender());
  }

  function order(uint256 amount, uint256 nonce, string memory productId, bytes memory signature) public virtual {
    require(!usedNonces[nonce], "CodeshiToken: already used this nonce");
    
    bytes32 hash = keccak256(abi.encodePacked(amount, nonce, productId, _msgSender()));
    bytes32 messageHash = hash.toEthSignedMessageHash();

    address signer = messageHash.recover(signature);
  
    require(hasRole(MINTER_ROLE, signer), "CodeshiToken: signature is not created by minter!"); // TODO: this should more like use separate role?

    _burn(_msgSender(), amount);
    usedNonces[nonce] = true;

    Order memory newOrder = Order(productId, nonce, block.number);
    orders[_msgSender()].push(newOrder);

    emit NewOrder(_msgSender(), productId);
  }
}