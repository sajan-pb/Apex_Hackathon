import { ethers } from "ethers";


// ==========================================
// CONTRACT ADDRESSES
// ==========================================

export const CONTRACT_ADDRESSES = {

  IdentityRegistry:
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",

  AssetNFT:
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",

  MultiSigAdmin:
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",

};


// ==========================================
// IDENTITY REGISTRY ABI
// ==========================================

export const IdentityRegistryABI = [

  // ISSUE IDENTITY

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


  // CHECK VALID IDENTITY

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


  // GET IDENTITY TOKEN

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


  // GET IDENTITY DETAILS

  {
    type: "function",
    name: "identities",

    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],

    outputs: [
      {
        name: "didDocumentCID",
        type: "string",
      },

      {
        name: "docHash",
        type: "bytes32",
      },

      {
        name: "issuedBy",
        type: "address",
      },

      {
        name: "issuedAt",
        type: "uint256",
      },

      {
        name: "revoked",
        type: "bool",
      },
    ],

    stateMutability: "view",
  },


  // VERIFY DOCUMENT

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


  // REVOKE IDENTITY

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


  // CHECK ROLE

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


  // MANAGER ROLE

  {
    type: "function",
    name: "MANAGER_ROLE",

    inputs: [],

    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],

    stateMutability: "view",
  },

];


// ==========================================
// ASSET NFT ABI
// ==========================================

export const AssetNFTABI = [

  // MINT ASSET

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


  // GET OWNER

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


  // GET BALANCE

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


  // GET ASSET METADATA

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


  // CHECK IDENTITY REGISTRY

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


  // MANAGER ROLE

  {
    type: "function",
    name: "MANAGER_ROLE",

    inputs: [],

    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],

    stateMutability: "view",
  },


  // CHECK ROLE

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

];


// ==========================================
// MULTISIG ADMIN ABI
// ==========================================

export const MultiSigAdminABI = [

  {
    "type": "function",
    "name": "propose",
    "inputs": [
      {
        "name": "actionType",
        "type": "uint8"
      },
      {
        "name": "target",
        "type": "address"
      },
      {
        "name": "role",
        "type": "bytes32"
      },
      {
        "name": "account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },

  {
    "type": "function",
    "name": "confirm",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },

  {
    "type": "function",
    "name": "isAdmin",
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  }

];


// ==========================================
// CREATE IDENTITY CONTRACT
// ==========================================

export const getIdentityContract = (
  signerOrProvider
) => {

  return new ethers.Contract(

    CONTRACT_ADDRESSES.IdentityRegistry,

    IdentityRegistryABI,

    signerOrProvider

  );

};


// ==========================================
// CREATE ASSET CONTRACT
// ==========================================

export const getAssetContract = (
  signerOrProvider
) => {

  return new ethers.Contract(

    CONTRACT_ADDRESSES.AssetNFT,

    AssetNFTABI,

    signerOrProvider

  );

};


// ==========================================
// CREATE MULTISIG CONTRACT
// ==========================================

export const getMultiSigContract = (
  signerOrProvider
) => {

  return new ethers.Contract(

    CONTRACT_ADDRESSES.MultiSigAdmin,

    MultiSigAdminABI,

    signerOrProvider

  );


};

