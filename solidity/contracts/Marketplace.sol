// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {

    IERC20 public token; // ETH
    IERC721 public Artwork; 

    struct Listing {
        uint256 tokenID;
        uint256 price;
    }

    // all listings
    // key: tokenID
    // value: Listing
    mapping(uint256 => Listing) public listings;

    constructor(IERC20 _token, IERC721 _NFT) {
        token = _token;
        Artwork = _NFT;
        owner = msg.sender;
    }

    function createListing(uint256 tokenID, uint256 price) external {
        require(msg.sender == owner, "Marketplace: not owner");
        Listing storage listing = listings[tokenID];
        require(listing.tokenID == 0, "Marketplace: listing already exists");
        listing.tokenID = tokenID;
        listing.price = price;
    }

    function buy(uint256 tokenID) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID != 0, "Marketplace: listing not found");
        require(token.balanceOf(msg.sender) >= listing.price,"Marketplace: balance not enough");

        token.transferFrom(msg.sender, owner, listing.price);
        Artwork.transferFrom(owner, msg.sender, tokenID);
    }

    function getPrice(uint256 tokenID) external view returns (uint256) {
        return listings[tokenID].price;
    }
}
