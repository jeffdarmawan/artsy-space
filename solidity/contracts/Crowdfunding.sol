// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {

    IERC20 public token;
    IERC721 public Artwork;

    // track contributions per address per event
    struct Listing {
        uint256 tokenID;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        address topDonor;

        // key: address
        // value: amount
        mapping(address => uint256) contributions;
    }

    // all listings
    // key: tokenID
    // value: Listing
    mapping(uint256 => Listing) public listings;

    constructor(IERC20 _token, IERC721 _NFT) {
        token = _token;
        Artwork = _NFT;
    }

    function createListing(uint256 tokenID, uint256 goal, uint256 deadline) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID == 0, "Crowdfunding: listing already exists");

        listing.tokenID = tokenID;
        listing.goal = goal;
        listing.deadline = deadline;
        listing.topDonor = Artwork.ownerOf(tokenID); //initialize first to avoid null error
    }

    function contribute(uint256 tokenID, uint256 amount) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID != 0, "Crowdfunding: listing not found");
        require(listing.deadline > block.timestamp, "Crowdfunding: deadline passed");
        require(listing.raised <= listing.goal, "Crowdfunding: goal reached"); // are restricting this?

        token.transferFrom(msg.sender, address(this), amount); // collected from platform first
        listing.contributions[msg.sender] += amount;
        listing.raised = listing.raised + amount;

        if (listing.contributions[msg.sender] > listing.contributions[listing.topDonor]) {
            listing.topDonor = msg.sender;
        }
    }

    function getContribution(uint256 tokenID, address contributor) external view returns (uint256) {
        return listings[tokenID].contributions[contributor];
    }

    function getTopContributor(uint256 tokenID) external view returns (address, uint256) {
        Listing storage listing = listings[tokenID];
        address topContributor = listing.topDonor;
        uint256 topAmount = listing.contributions[topContributor];
        return (topContributor, topAmount);
    }

    
    // disburse rewards
    // - transfer NFT to top contributor
    // - transfer funds to owner (or designated recipient)


    //make this automatic called when reach deadline/goal?
    function disburseRewards(uint256 tokenID) external {
        Listing storage listing = listings[tokenID];
        address owner = Artwork.ownerOf(tokenID);
        require(listing.tokenID != 0, "Crowdfunding: listing not found");
        require(listing.deadline < block.timestamp, "Crowdfunding: deadline not passed");
        require(listing.raised >= listing.goal, "Crowdfunding: goal not reached");

        
        address topContributor = listing.topDonor;

        // transfer NFT to top contributor
        Artwork.transferFrom(address(this), topContributor, listing.tokenID);

        // transfer funds to owner
        token.transfer(owner, listing.raised);
    }
}