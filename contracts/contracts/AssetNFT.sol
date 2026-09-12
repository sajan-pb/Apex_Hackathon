// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./TimeBoundAccessControl.sol";
import "./IdentityRegistry.sol";

contract AssetNFT is ERC721, TimeBoundAccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    struct AssetMeta {
        string metadataCID;
        uint256 mintedAt;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => AssetMeta) public assets;

    IdentityRegistry public immutable identityRegistry;

    event AssetMinted(uint256 indexed tokenId, address indexed owner, string cid);
    event AssetTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address admin, address identityRegistryAddress) ERC721("Apex Vault Asset", "APEX-ASSET") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
        identityRegistry = IdentityRegistry(identityRegistryAddress);
    }

    // Only a Manager can mint — this is the one place a role check applies
    function mintTo(address to, string calldata cid) external onlyRole(MANAGER_ROLE) returns (uint256 tokenId) {
        require(identityRegistry.hasValidIdentity(to), "recipient has no valid identity");
        tokenId = _nextTokenId++;
        assets[tokenId] = AssetMeta(cid, block.timestamp);
        _safeMint(to, tokenId);
        emit AssetMinted(tokenId, to, cid);
    }

    // Ordinary owner-initiated transfers stay open to anyone who owns the token —
    // the ONLY extra rule is that the recipient must hold a valid identity.
    // This is deliberate: it's not a role check, it's an identity check.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            require(identityRegistry.hasValidIdentity(to), "recipient has no valid identity");
            emit AssetTransferred(tokenId, from, to);
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}