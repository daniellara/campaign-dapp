pragma solidity ^0.4.24;

contract Campaign {

    struct Request {
        string description;
        uint amount;
        address vendor;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;

    modifier restricted() {
        require(
            msg.sender == manager,
            "Only the manager can call this function"
        );
        _;
    }

    constructor (uint _minAmount) public {
        manager = msg.sender;
        minimumContribution = _minAmount;
    }

    function contribute() public payable{
        require(
            msg.value >= minimumContribution,
            "Please insert at least the minimum contribution"
        );

        approvers.push(msg.sender);
    }

    function createRequest(string _description, uint _amount, address _vendor) public restricted{
        Request req = Request({
            description: _description,
            amount: _amount,
            vendor: _vendor,
            complete: false
        });

        requests.push(req);
    }

}
