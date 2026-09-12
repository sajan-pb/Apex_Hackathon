// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./TimeBoundAccessControl.sol";

contract IdentityRegistry is ERC721, TimeBoundAccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

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
        _grantRole(MANAGER_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
    }

    function issueIdentity(address to, string calldata cid, bytes32 docHash)
        external
        onlyRole(MANAGER_ROLE)
        returns (uint256 tokenId)
    {
        require(identityOf[to] == 0, "identity already issued");
        tokenId = _nextTokenId++;
        identities[tokenId] = Identity(cid, docHash, msg.sender, block.timestamp, false);
        identityOf[to] = tokenId;
        _safeMint(to, tokenId);
        emit IdentityIssued(tokenId, to, cid, docHash);
    }

    function revokeIdentity(uint256 tokenId) external onlyRole(MANAGER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "identity does not exist");
        identities[tokenId].revoked = true;
        emit IdentityRevoked(tokenId, msg.sender);
    }

    function hasValidIdentity(address account) external view returns (bool valid) {
        uint256 tokenId = identityOf[account];
        if (tokenId == 0) return false;
        return !identities[tokenId].revoked;
    }

    function verifyDocument(uint256 tokenId, bytes calldata documentBytes) external view returns (bool matches_) {
        return keccak256(documentBytes) == identities[tokenId].docHash;
    }

    // Soulbound enforcement: no role can override this, identity can never move once issued
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "identity is soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}