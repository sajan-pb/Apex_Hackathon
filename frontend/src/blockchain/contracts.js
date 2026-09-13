// ==========================================
// IDENTITY REGISTRY ABI
// ==========================================

export const IdentityRegistryABI = [
  {
    type: "function",
    name: "issueIdentity",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "cid",
        type: "string",
      },
      {
        name: "docHash",
        type: "bytes32",
      },
    ],
    outputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "hasValidIdentity",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "identityOf",
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "verifyDocument",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "documentBytes",
        type: "bytes",
      },
    ],
    outputs: [
      {
        name: "matches_",
        type: "bool",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "revokeIdentity",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
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
      {
        name: "to",
        type: "address",
      },
      {
        name: "cid",
        type: "string",
      },
    ],
    outputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "ownerOf",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "assets",
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "metadataCID",
        type: "string",
      },
      {
        name: "mintedAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "identityRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
  },
];


// ==========================================
// ACCESS CONTROL ABI
// ==========================================

export const AccessControlABI = [
  {
    type: "function",
    name: "hasRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "grantRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "revokeRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "roleExpiry",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "grantRoleWithExpiry",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
      {
        name: "expiresAt",
        type: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];