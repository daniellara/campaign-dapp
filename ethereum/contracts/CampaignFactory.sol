pragma solidity ^0.5.0;

import "./Campaign.sol";

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint minAmount) public{
        Campaign newCampaign = new Campaign(minAmount, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory){
        return deployedCampaigns;
    }
}