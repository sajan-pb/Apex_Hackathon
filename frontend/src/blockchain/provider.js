import { ethers } from "ethers";

// ==========================================
// HARDHAT LOCAL NETWORK
// ==========================================

export const HARDHAT_CHAIN_ID = 31337;

export const HARDHAT_NETWORK = {
  chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}`,
  chainName: "Hardhat Localhost",
  rpcUrls: ["http://127.0.0.1:8545"],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};


// ==========================================
// CHECK IF METAMASK IS INSTALLED
// ==========================================

export const isMetaMaskInstalled = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined"
  );
};


// ==========================================
// GET BROWSER PROVIDER
// ==========================================

export const getProvider = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error(
      "MetaMask is not installed. Please install MetaMask first."
    );
  }

  return new ethers.BrowserProvider(
    window.ethereum
  );
};


// ==========================================
// CONNECT WALLET
// ==========================================

export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error(
      "MetaMask is not installed."
    );
  }

  const provider = getProvider();

  await provider.send(
    "eth_requestAccounts",
    []
  );

  const signer = await provider.getSigner();

  const walletAddress =
    await signer.getAddress();

  return {
    provider,
    signer,
    walletAddress,
  };
};


// ==========================================
// GET CURRENT WALLET
// ==========================================

export const getCurrentWallet = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  const accounts =
    await window.ethereum.request({
      method: "eth_accounts",
    });

  if (!accounts || accounts.length === 0) {
    return null;
  }

  return accounts[0];
};


// ==========================================
// GET SIGNER
// ==========================================

export const getSigner = async () => {
  const provider = getProvider();

  return await provider.getSigner();
};


// ==========================================
// GET NETWORK
// ==========================================

export const getNetwork = async () => {
  const provider = getProvider();

  return await provider.getNetwork();
};


// ==========================================
// CHECK HARDHAT NETWORK
// ==========================================

export const isCorrectNetwork = async () => {
  const network = await getNetwork();

  return Number(network.chainId) ===
    HARDHAT_CHAIN_ID;
};


// ==========================================
// ADD / SWITCH TO HARDHAT NETWORK
// ==========================================

export const switchToHardhatNetwork = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error(
      "MetaMask is not installed."
    );
  }

  try {

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",

      params: [
        {
          chainId:
            HARDHAT_NETWORK.chainId,
        },
      ],
    });

  } catch (switchError) {

    // Network does not exist in MetaMask
    if (switchError.code === 4902) {

      await window.ethereum.request({
        method: "wallet_addEthereumChain",

        params: [
          HARDHAT_NETWORK,
        ],
      });

    } else {

      throw switchError;

    }

  }

};


// ==========================================
// CONNECT WALLET + HARDHAT
// ==========================================

export const connectToBlockchain = async () => {

  await switchToHardhatNetwork();

  const wallet =
    await connectWallet();

  const network =
    await getNetwork();

  return {
    ...wallet,

    chainId:
      Number(network.chainId),

    networkName:
      network.name,
  };
};