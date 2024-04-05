// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// each user can only vote once
contract Voting {

    IERC20 public token; // voting token
    address public owner;

    // track votes per address per event
    // key1: weekly timestamp
    // key2: tokenID
    // value: amount
    mapping(uint256 => mapping(uint256 => uint256)) public votes;

    // keep track of votes per address
    // key1: weekly timestamp
    // key2: tokenID
    // value: amount
    mapping(uint256 => mapping(address => uint256)) public voteCount;

    constructor(IERC20 _token) {
        token = _token;
        owner = msg.sender;
    }

    function vote(uint256 tokenID, uint256 amount) external {
        require(voteCount[weeklyTimestamp][msg.sender] == 0, "Voting: already voted");
        require(amount > 0, "Voting: amount must be greater than 0");

        token.transferFrom(msg.sender, address(this), amount); // transfer voting token?
        votes[weeklyTimestamp][tokenID] += amount;
        voteCount[weeklyTimestamp][msg.sender] = amount;
    }

    function getMostVoted(uint256 weeklyTimestamp) external view returns (uint256) {
        uint256 mostVotedTokenID;
        uint256 mostVotes;
        for (uint256 tokenID = 0; tokenID < 10; tokenID++) {
            if (votes[weeklyTimestamp][tokenID] > mostVotes) {
                mostVotes = votes[weeklyTimestamp][tokenID];
                mostVotedTokenID = tokenID;
            }
        }
        return mostVotedTokenID;
    }

    // function withdraw() external {
    //     require(block.timestamp >= deadline, "Crowdfunding: deadline not passed");
    //     require(raised >= goal, "Crowdfunding: goal not reached");
    //     require(msg.sender == owner, "Crowdfunding: not owner");
    //     token.transfer(owner, raised);
    // }
}
