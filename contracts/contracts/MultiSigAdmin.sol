// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiSigAdmin {
    uint256 public constant THRESHOLD = 2;
    address[3] public admins;

    enum ActionType { GRANT_ROLE, REVOKE_ROLE, REVOKE_IDENTITY }

    struct Proposal {
        ActionType actionType;
        address target;
        bytes32 role;
        address account;
        uint256 confirmations;
        bool executed;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public confirmedBy;

    constructor(address admin0, address admin1, address admin2) {
        admins[0] = admin0;
        admins[1] = admin1;
        admins[2] = admin2;
    }

    function isAdmin(address account) public view returns (bool result) {
        result = account == admins[0] || account == admins[1] || account == admins[2];
    }

    // TODO Round 3
    function propose(ActionType actionType, address target, bytes32 role, address account)
        external
        returns (uint256 proposalId)
    {}

    // TODO Round 3
    function confirm(uint256 proposalId) external {}
}