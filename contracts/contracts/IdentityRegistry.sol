// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./TimeBoundAccessControl.sol";

contract IdentityRegistry is ERC721, TimeBoundAccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Identity {
        string didDocumentCID;
        bytes32 docHash;
        address issuedBy;
        uint256 issuedAt;
        bool revoked;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => Identity) public identities;
    mapping(address => uint256) public identityOf;

    event IdentityIssued(uint256 indexed tokenId, address indexed owner, string cid, bytes32 docHash);
    event IdentityRevoked(uint256 indexed tokenId, address indexed by);

    constructor(address admin) ERC721("Apex Decentralized Identity", "APEX-ID") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    // TODO Round 2
    function issueIdentity(address to, string calldata cid, bytes32 docHash)
        external
        onlyRole(ISSUER_ROLE)
        returns (uint256 tokenId)
    {}

    // TODO Round 2
    function revokeIdentity(uint256 tokenId) external onlyRole(ISSUER_ROLE) {}

    // TODO Round 2
    function hasValidIdentity(address account) external view returns (bool valid) {}

    // TODO Round 2
    function verifyDocument(uint256 tokenId, bytes calldata documentBytes) external view returns (bool matches_) {}

    // TODO Round 2 — this is what makes it soulbound
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}