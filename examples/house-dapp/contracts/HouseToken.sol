pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract HouseToken is ERC721Token("HouseToken", "AHT") {

  function create(string uri) public {
    uint256 id = allTokens.length + 1;
    _mint(msg.sender, id);
    _setTokenURI(id, uri);
  }

}
