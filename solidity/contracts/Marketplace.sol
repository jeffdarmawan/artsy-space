// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {

    IERC20 public token; 
    IERC721 public Artwork; 

    struct Listing {
        uint256 tokenID;
        uint256 price;
    }

    // all listings
    // key: tokenID
    // value: Listing
    mapping(uint256 => Listing) public listings;
    uint256[] public listedTokens;

    event ArtworkListed(uint256 indexed tokenID, uint256 price);
    event ArtworkSold(uint256 indexed tokenID, address indexed seller, address indexed buyer, uint256 price);

    constructor(address _token, address _NFT) {
        token = IERC20(_token);
        Artwork = IERC721(_NFT);
    }

    function createListing(uint256 tokenID, uint256 price) external {
        Listing storage listing = listings[tokenID];
        require(msg.sender == Artwork.ownerOf(tokenID), "Marketplace: not owner");
        require(listing.tokenID == 0, "Marketplace: listing already exists");

        listing.tokenID = tokenID;
        listing.price = price;
        listedTokens.push(tokenID);

        emit ArtworkListed(tokenID, price);
    }

    //  before buying, the artwork owner must approve the marketplace contract to transfer the artwork
    //  before buying, the buyer must approve the marketplace contract to transfer the token
    function buy(uint256 tokenID) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID != 0, "Marketplace: listing not found");

        address owner = Artwork.ownerOf(tokenID);

        require(token.balanceOf(msg.sender) >= listing.price,"Marketplace: balance not enough");

        uint256 platformFee = listing.price * 3 / 100; // 3% of the listing price
        platformFee = platformFee < 5 ? 5 : platformFee; // Set minimum fee to 5
        uint256 remainingAmount = listing.price - platformFee;

        // Transfer the remaining amount to the owner
        token.transferFrom(msg.sender, owner, remainingAmount);

        // Transfer the platform fee to the contract
        token.transferFrom(msg.sender, address(this), platformFee);
        Artwork.transferFrom(owner, msg.sender, tokenID);
        
        delete listings[tokenID];

        emit ArtworkSold(tokenID, owner, msg.sender, listing.price);
    }

    function getPrice(uint256 tokenID) external view returns (uint256) {
        return listings[tokenID].price;
    }

    function getAllListedTokens() external view returns (uint256[] memory){
        return listedTokens;
    }
}
