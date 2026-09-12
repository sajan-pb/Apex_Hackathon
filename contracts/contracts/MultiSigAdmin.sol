// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/access/IAccessControl.sol";

/// @title MultiSigAdmin
/// @notice A narrow, purpose-built 2-of-3 multisig. It does NOT support
///         arbitrary calls — only the three specific actions this system
///         actually needs: granting a role, revoking a role, and revoking
///         an identity. This contract is meant to itself HOLD the
///         DEFAULT_ADMIN_ROLE (and, for identity revocation, MANAGER_ROLE)
///         on IdentityRegistry and AssetNFT, so that no single wallet can
///         unilaterally take a sensitive action.
contract MultiSigAdmin {
    uint256 public constant THRESHOLD = 2;
    address[3] public admins;

    enum ActionType { GRANT_ROLE, REVOKE_ROLE, REVOKE_IDENTITY }

    struct Proposal {
        ActionType actionType;
        address target;   // IdentityRegistry or AssetNFT address
        bytes32 role;      // used for GRANT_ROLE / REVOKE_ROLE, ignored for REVOKE_IDENTITY
        address account;   // who the role applies to, or whose identity is being revoked
        uint256 confirmations;
        bool executed;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public confirmedBy;

    event Proposed(uint256 indexed proposalId, address indexed proposer, ActionType actionType, address target, address account);
    event Confirmed(uint256 indexed proposalId, address indexed confirmer, uint256 confirmations);
    event Executed(uint256 indexed proposalId, ActionType actionType);

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "not a designated admin");
        _;
    }

    constructor(address admin0, address admin1, address admin2) {
        admins[0] = admin0;
        admins[1] = admin1;
        admins[2] = admin2;
    }

    function isAdmin(address account) public view returns (bool result) {
        result = account == admins[0] || account == admins[1] || account == admins[2];
    }

    /// @notice Propose one of the three supported actions. Auto-confirms as the proposer.
    function propose(ActionType actionType, address target, bytes32 role, address account)
        external
        onlyAdmin
        returns (uint256 proposalId)
    {
        proposalId = proposals.length;
        proposals.push(Proposal(actionType, target, role, account, 0, false));
        emit Proposed(proposalId, msg.sender, actionType, target, account);
        _confirm(proposalId);
    }

    /// @notice A second (or third) designated admin confirms a pending proposal.
    function confirm(uint256 proposalId) external onlyAdmin {
        _confirm(proposalId);
    }

    function _confirm(uint256 proposalId) internal {
        require(proposalId < proposals.length, "no such proposal");
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "already executed");
        require(!confirmedBy[proposalId][msg.sender], "already confirmed by you");

        confirmedBy[proposalId][msg.sender] = true;
        p.confirmations += 1;
        emit Confirmed(proposalId, msg.sender, p.confirmations);

        if (p.confirmations >= THRESHOLD) {
            _execute(proposalId);
        }
    }

    function _execute(uint256 proposalId) internal {
        Proposal storage p = proposals[proposalId];
        p.executed = true;

        if (p.actionType == ActionType.GRANT_ROLE) {
            IAccessControl(p.target).grantRole(p.role, p.account);
        } else if (p.actionType == ActionType.REVOKE_ROLE) {
            IAccessControl(p.target).revokeRole(p.role, p.account);
        } else if (p.actionType == ActionType.REVOKE_IDENTITY) {
            uint256 tokenId = IIdentityRegistryMinimal(p.target).identityOf(p.account);
            require(tokenId != 0, "account has no identity");
            IIdentityRegistryMinimal(p.target).revokeIdentity(tokenId);
        }

        emit Executed(proposalId, p.actionType);
    }

    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }
}

/// @dev Minimal interface so MultiSigAdmin doesn't need to import the full
///      IdentityRegistry contract — keeps this file self-contained.
interface IIdentityRegistryMinimal {
    function identityOf(address account) external view returns (uint256);
    function revokeIdentity(uint256 tokenId) external;
}