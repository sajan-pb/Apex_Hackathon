import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./addresses.js";

// ==========================================
// IDENTITY REGISTRY ABI
// ==========================================

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
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
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
];

// ==========================================
// ASSET NFT ABI
// ==========================================

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
    inputs: [{ name: "", type: "uint256" }],
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
];

// ==========================================
// ACCESS CONTROL ABI — shared by IdentityRegistry & AssetNFT
// (includes the role-constant getters, which are what was missing before)
// ==========================================

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

// ==========================================
// MULTISIG ADMIN ABI
// ==========================================

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
];

// ==========================================
// CONTRACT INSTANCE FACTORY
// ==========================================

const ABIS_BY_NAME = {
  IdentityRegistry: [...IdentityRegistryABI, ...AccessControlABI],
  AssetNFT: [...AssetNFTABI, ...AccessControlABI],
  MultiSigAdmin: MultiSigAdminABI,
};

export const getContract = (name, signerOrProvider) => {
  const address = CONTRACT_ADDRESSES[name];
  if (!address) {
    throw new Error(`No deployed address found for ${name}. Did you run the deploy script?`);
  }
  const abi = ABIS_BY_NAME[name];
  if (!abi) {
    throw new Error(`No ABI found for contract name "${name}".`);
  }
  return new ethers.Contract(address, abi, signerOrProvider);
};