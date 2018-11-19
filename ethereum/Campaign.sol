pragma solidity ^0.4.24;

contract Campaign {

    address public manager;
    uint public minimumContribution;

    constructor (uint _minAmount) public {
        manager = msg.sender;
        minimumContribution = _minAmount;
    }
}
