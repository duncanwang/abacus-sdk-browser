pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract HouseToken is ERC721Token("HouseToken", "AHT"), Ownable {

    /**
    * @dev Mints a token to an address.
    * @param _to address of the future owner of the token
    */
    function mintTo(
        address _to
    ) public onlyOwner returns (uint256 tokenId) {
        tokenId = totalSupply().add(1);
        _mint(_to, tokenId);
    }

   /**
    * @dev Sets token metadata URI.
    * @param _tokenId ID of token
    * @param _tokenURI token URI for the token
    */
    function setTokenURI(
        uint256 _tokenId, string _tokenURI
    ) public onlyOwner {
        _setTokenURI(_tokenId, _tokenURI);
    }

}
