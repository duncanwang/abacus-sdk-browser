pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract HouseToken is ERC721Token("HouseToken", "AHT") {

  function create() public {
    _mint(msg.sender, allTokens.length + 1);
  }

}