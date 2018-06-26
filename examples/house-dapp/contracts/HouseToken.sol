pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract HouseToken is ERC721Token("HouseToken", "AHT"), Ownable {

  /**
  * @dev Mints a token to an address with a tokenURI.
  * @param _to address of the future owner of the token
  * @param _tokenURI token URI for the token
  */
  function mintTo(address _to, string _tokenURI) public onlyOwner {
      uint256 newTokenId = totalSupply().add(1);
      _mint(_to, newTokenId);
      _setTokenURI(newTokenId, _tokenURI);
  }

}
