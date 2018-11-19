pragma solidity ^0.4.24;

contract Campaign {

    address public manager;
    uint public minimumContribution;
    address[] public approvers;

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
}
