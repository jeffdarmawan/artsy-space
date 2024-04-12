// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {

    IERC20 public token;
    IERC721 public NFT;

    // track contributions per address per event
    struct Listing {
        uint256 tokenID;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        address topDonor;
        uint256 maxContribution;

        // address designatedRecipient; // are making it this way?

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
        NFT = _NFT;
    }

    function createListing(uint256 tokenID, uint256 goal, uint256 deadline) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID == 0, "Crowdfunding: listing already exists");
        listing.tokenID = tokenID;
        listing.goal = goal;
        listing.deadline = deadline;
    }

    function contribute(uint256 tokenID, uint256 amount) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID != 0, "Crowdfunding: listing not found");
        require(listing.deadline > block.timestamp, "Crowdfunding: deadline passed");
        require(listing.raised <= listing.goal, "Crowdfunding: goal reached"); // are restricting this?

        token.transferFrom(msg.sender, address(this), amount); // collected from platform first
        listing.contributions[msg.sender] += amount;
        listing.raised = listing.raised + amount;
    }

    function getContribution(uint256 tokenID, address contributor) external view returns (uint256) {
        return listings[tokenID].contributions[contributor];
    }

    function getTopContributor(uint256 tokenID) external view returns (address, uint256) {
        Listing storage listing = listings[tokenID];
        address topContributor;
        uint256 topAmount;
        for (uint256 i = 0; i < listing.contributions.length; i++) {
            if (listing.contributions[i] > topAmount) {
                topAmount = listing.contributions[i];
                topContributor = i;
            }
        }
        return (topContributor, topAmount);
    }

    // disburse rewards
    // - transfer NFT to top contributor
    // - transfer funds to owner (or designated recipient)
}