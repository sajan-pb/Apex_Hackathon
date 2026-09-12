// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./TimeBoundAccessControl.sol";
import "./IdentityRegistry.sol";

contract AssetNFT is ERC721, TimeBoundAccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
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
        _grantRole(MINTER_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
        identityRegistry = IdentityRegistry(identityRegistryAddress);
    }

    // TODO Round 2
    function mintTo(address to, string calldata cid) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {}

    // TODO Round 2
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}