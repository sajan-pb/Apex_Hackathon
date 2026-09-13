import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./addresses.js";

export const IdentityRegistryABI = [
  {
    type: "function",
    name: "issueIdentity",
    inputs: [
      { name: "to", type: "address" },
      { name: "cid", type: "string" },
      { name: "docHash", type: "bytes32" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasValidIdentity",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "valid", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "identityOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "identities",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "didDocumentCID", type: "string" },
      { name: "docHash", type: "bytes32" },
      { name: "issuedBy", type: "address" },
      { name: "issuedAt", type: "uint256" },
      { name: "revoked", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifyDocument",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "documentBytes", type: "bytes" },
    ],
    outputs: [{ name: "matches_", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revokeIdentity",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MANAGER_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "AUDITOR_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "IdentityIssued",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "cid", type: "string", indexed: false },
      { name: "docHash", type: "bytes32", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "IdentityRevoked",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "by", type: "address", indexed: true },
    ],
    anonymous: false,
  },
];

export const AssetNFTABI = [
  {
    type: "function",
    name: "mintTo",
    inputs: [
      { name: "to", type: "address" },
      { name: "cid", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "assets",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "metadataCID", type: "string" },
      { name: "mintedAt", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "identityRegistry",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MANAGER_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "AUDITOR_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AssetMinted",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "cid", type: "string", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetTransferred",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
    anonymous: false,
  },
];

export const AccessControlABI = [
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "roleExpiry",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRoleWithExpiry",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
      { name: "expiresAt", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MANAGER_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "AUDITOR_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
];

export const MultiSigAdminABI = [
  {
    type: "function",
    name: "propose",
    inputs: [
      { name: "actionType", type: "uint8" },
      { name: "target", type: "address" },
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "proposalId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "confirm",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isAdmin",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "result", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "admins",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposals",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "actionType", type: "uint8" },
      { name: "target", type: "address" },
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
      { name: "confirmations", type: "uint256" },
      { name: "executed", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposalCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "confirmedBy",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Proposed",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "proposer", type: "address", indexed: true },
      { name: "actionType", type: "uint8", indexed: false },
      { name: "target", type: "address", indexed: false },
      { name: "account", type: "address", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Confirmed",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "confirmer", type: "address", indexed: true },
      { name: "confirmations", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "actionType", type: "uint8", indexed: false },
    ],
    anonymous: false,
  },
];

const ABIS_BY_NAME = {
  IdentityRegistry: [...IdentityRegistryABI, ...AccessControlABI],
  AssetNFT: [...AssetNFTABI, ...AccessControlABI],
  MultiSigAdmin: MultiSigAdminABI,
};

export const getContract = (name, signerOrProvider) => {
  const address = CONTRACT_ADDRESSES[name];
  if (!address) {
    throw new Error(`No deployed address found for ${name}.`);
  }
  const abi = ABIS_BY_NAME[name];
  if (!abi) {
    throw new Error(`No ABI found for contract name "${name}".`);
  }
  return new ethers.Contract(address, abi, signerOrProvider);
};
