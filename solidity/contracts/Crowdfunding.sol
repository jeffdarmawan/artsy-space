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
        address owner;

        mapping(address => uint256) contributions;
    }

    // all listings
    // key: tokenID
    // value: Listing
    mapping(uint256 => Listing) public listings;
    uint256[] public listedTokens;

    struct Contribution {
        address contributor;
        uint256 amount;
    }

    mapping(uint256 => Contribution[]) public contributions;

    constructor(address _token, address _NFT) {
        token = IERC20(_token);
        Artwork = IERC721(_NFT);
    }

    function createListing(uint256 tokenID, uint256 goal, uint256 numdays) external {
        Listing storage listing = listings[tokenID];
        require(msg.sender == Artwork.ownerOf(tokenID), "Crowdfunding: not owner");
        require(listing.tokenID == 0, "Crowdfunding: listing already exists");

        listing.tokenID = tokenID;
        listing.goal = goal;
        uint256 deadline = block.timestamp + (numdays * 1 days);
        listing.deadline = deadline;
        listing.owner = msg.sender;
        listing.topDonor = Artwork.ownerOf(tokenID); //initialize first to avoid null error
    }

    function contribute(uint256 tokenID, uint256 amount) external {
        Listing storage listing = listings[tokenID];
        require(listing.tokenID != 0, "Crowdfunding: listing not found");
        require(listing.deadline > block.timestamp, "Crowdfunding: deadline passed");
        
        token.transferFrom(msg.sender, address(this), amount); // collected from platform first
        listing.contributions[msg.sender] += amount;

        if (listing.contributions[msg.sender] > listing.contributions[listing.topDonor]) {
            listing.topDonor = msg.sender;
        }
        //put into the contribution record list
        Contribution[] storage contributorList = contributions[tokenID];
        bool found = false;
        for (uint256 i = 0; i < contributorList.length; i++) {
            if (contributorList[i].contributor == msg.sender) {
                contributorList[i].amount += amount;
                found = true;
                break;
            }
        }
        if (!found) {
            contributorList.push(Contribution(msg.sender, amount));
        }
        
        listing.raised += amount; // Update total raised amount

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
    // transfer funds to owner (or designated recipient

    //make this automatic called when reach deadline
    //refund if deadline passed and goal not reached
    function disburseRewards(uint256 tokenID) external {
        Listing storage listing = listings[tokenID];
        address owner = Artwork.ownerOf(tokenID);
        require(listing.tokenID != 0, "Crowdfunding: listing not found");
        require(listing.deadline < block.timestamp, "Crowdfunding: deadline not passed");
        
        require(listing.raised > 0, "Crowdfunding: no money is raised / is distributed");
        
        address topContributor = listing.topDonor;

        if(listing.raised >= listing.goal) {
            // transfer NFT to top contributor
            Artwork.transferFrom(owner, topContributor, listing.tokenID);
            // transfer funds to owner
            token.transfer(owner, listing.raised);
        } else {
            // refund all contributors
            for (uint256 i = 0; i < contributions[tokenID].length; i++) {
                token.transfer(contributions[tokenID][i].contributor, contributions[tokenID][i].amount);
                contributions[tokenID][i].amount = 0; // Set contribution amount to zero
            }
        }

        // reset the listing
        listing.raised = 0; 
    }

    function getListing(uint256 _tokenID) external view returns (
        uint256 goal,
        uint256 deadline,
        uint256 raised,
        address topDonor,
        address owner) {
        Listing storage listing = listings[_tokenID];
        return (listing.goal, listing.deadline, listing.raised, listing.topDonor, listing.owner);
    }

    function getAllListedTokens() external view returns (uint256[] memory){
        return listedTokens;
    }
}