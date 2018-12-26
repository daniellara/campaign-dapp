pragma solidity ^0.5.0;

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

contract Campaign {

    struct Request {
        string description;
        uint amount;
        address payable vendor;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) approvers;
    uint public approversCount;
    Request[] public requests;

    constructor (uint _minAmount, address creator) public {
        manager = creator;
        minimumContribution = _minAmount;
    }

    modifier restricted() {
        require(
            msg.sender == manager,
            "Only the manager can call this function"
        );
        _;
    }

    function contribute() public payable{
        require(
            msg.value >= minimumContribution,
            "Please insert at least the minimum contribution"
        );

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory _description, uint _amount, address payable _vendor) public restricted{
        Request memory req = Request({
            description: _description,
            amount: _amount,
            vendor: _vendor,
            complete: false,
            approvalCount: 0
        });

        requests.push(req);
    }

    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        require(approvers[msg.sender], "Only contributors can approve requests");
        require(!request.approvals[msg.sender], "You have already vote this request");

        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint requestIndex) public restricted{
        Request storage request = requests[requestIndex];

        require(request.approvalCount > (approversCount / 2), "Not enough approvers");
        require(!request.complete, "The request has already completed");

        request.vendor.transfer(request.amount);
        request.complete = true;
    }

}
