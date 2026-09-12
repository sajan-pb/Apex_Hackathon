// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract TimeBoundAccessControl is AccessControl {
    mapping(bytes32 => mapping(address => uint256)) public roleExpiry;

    event RoleGrantedWithExpiry(bytes32 indexed role, address indexed account, uint256 expiresAt);

    function grantRoleWithExpiry(bytes32 role, address account, uint256 expiresAt)
        external
        onlyRole(getRoleAdmin(role))
    {
        require(expiresAt == 0 || expiresAt > block.timestamp, "expiry must be in the future");
        _grantRole(role, account);
        roleExpiry[role][account] = expiresAt;
        emit RoleGrantedWithExpiry(role, account, expiresAt);
    }

    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        if (!super.hasRole(role, account)) return false;
        uint256 expiresAt = roleExpiry[role][account];
        return expiresAt == 0 || expiresAt > block.timestamp;
    }
}