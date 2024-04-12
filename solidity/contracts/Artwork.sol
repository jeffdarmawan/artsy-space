// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Artwork {

    IERC721 public NFT; // NFT representing artwork
    address public artist; // Owner of the artwork

    event ArtworkCreated(uint256 indexed tokenID, address indexed artist, uint256 price);

    constructor(IERC721 _NFT) {
        NFT = _NFT;
        artist = msg.sender;
    }

    function createArtwork(uint256 tokenID) external {
        require(NFT.ownerOf(tokenID) == msg.sender, "Artwork: caller is not the owner of the NFT");
        emit ArtworkCreated(tokenID, msg.sender, 0);
    }

    function setPrice(uint256 tokenID, uint256 price) external {
        require(NFT.ownerOf(tokenID) == msg.sender, "Artwork: caller is not the owner of the NFT");
        emit ArtworkCreated(tokenID, msg.sender, price);
    }

    function buyArtwork(uint256 tokenID, address marketplace, uint256 price) external {
        require(NFT.ownerOf(tokenID) == artist, "Artwork: artwork is not owned by the artist");
        require(price > 0, "Artwork: price must be greater than zero");
        
        // Transfer ownership of NFT to the buyer
        NFT.transferFrom(artist, msg.sender, tokenID);
        
        // Transfer payment to the artist
        IERC20(marketplace).transferFrom(msg.sender, artist, price);
    }

    function getArtist(uint256 tokenID) external view returns (address) {
        return artist;
    }

    function getPrice(uint256 tokenID) external view returns (uint256) {
        return NFT.ownerOf(tokenID) == artist ? 0 : 1; // Return 0 if the caller is the artist, otherwise 1
    }
}
