import { useState } from "react";
import { ethers } from "ethers";

import {
  connectToBlockchain,
  isCorrectNetwork,
} from "../blockchain/provider";

import {
  CONTRACT_ADDRESSES,
} from "../blockchain/addresses";

import {
  AssetNFTABI,
  IdentityRegistryABI,
} from "../blockchain/contracts";


function DigitalAssets({
  walletAddress,
  isConnected,
  addActivity,
}) {

  // ==========================================
  // STATES
  // ==========================================

  const [recipientAddress, setRecipientAddress] =
    useState("");

  const [metadataCID, setMetadataCID] =
    useState("");

  const [isMinting, setIsMinting] =
    useState(false);

  const [mintResult, setMintResult] =
    useState(null);

  const [assetTokenId, setAssetTokenId] =
    useState("");

  const [assetOwner, setAssetOwner] =
    useState("");

  const [assetMetadata, setAssetMetadata] =
    useState(null);

  const [isCheckingAsset, setIsCheckingAsset] =
    useState(false);

  const [walletBalance, setWalletBalance] =
    useState(null);

  const [isCheckingBalance, setIsCheckingBalance] =
    useState(false);


  // ==========================================
  // CONNECT TO CONTRACT
  // ==========================================

  const getContracts = async () => {

    const connection =
      await connectToBlockchain();

    const {
      provider,
      signer,
    } = connection;

    const assetContract =
      new ethers.Contract(
        CONTRACT_ADDRESSES.AssetNFT,
        AssetNFTABI,
        signer
      );

    const identityContract =
      new ethers.Contract(
        CONTRACT_ADDRESSES.IdentityRegistry,
        IdentityRegistryABI,
        signer
      );

    return {
      provider,
      signer,
      assetContract,
      identityContract,
    };
  };


  // ==========================================
  // MINT ASSET
  // ==========================================

  const mintAsset = async () => {

    try {

      setMintResult(null);

      // ------------------------------
      // CHECK WALLET
      // ------------------------------

      if (!isConnected) {

        setMintResult({
          type: "error",

          message:
            "Please connect your MetaMask wallet first.",
        });

        return;
      }


      // ------------------------------
      // VALIDATE ADDRESS
      // ------------------------------

      if (
        !recipientAddress ||
        !ethers.isAddress(recipientAddress)
      ) {

        setMintResult({
          type: "error",

          message:
            "Please enter a valid recipient wallet address.",
        });

        return;
      }


      // ------------------------------
      // VALIDATE METADATA
      // ------------------------------

      if (!metadataCID.trim()) {

        setMintResult({
          type: "error",

          message:
            "Please enter asset metadata or a CID.",
        });

        return;
      }


      setIsMinting(true);


      // ------------------------------
      // CONNECT
      // ------------------------------

      const {
        assetContract,
        identityContract,
      } =
        await getContracts();


      // ------------------------------
      // CHECK NETWORK
      // ------------------------------

      const correctNetwork =
        await isCorrectNetwork();

      if (!correctNetwork) {

        throw new Error(
          "Please switch MetaMask to Hardhat Localhost."
        );

      }


      // ------------------------------
      // CHECK IDENTITY
      // ------------------------------

      const hasIdentity =
        await identityContract.hasValidIdentity(
          recipientAddress
        );

      if (!hasIdentity) {

        setMintResult({
          type: "error",

          message:
            "Recipient does not have a valid blockchain identity. Assets can only be minted to verified identities.",
        });

        setIsMinting(false);

        return;
      }


      // ------------------------------
      // MINT NFT
      // ------------------------------

      const transaction =
        await assetContract.mintTo(
          recipientAddress,
          metadataCID
        );


      setMintResult({
        type: "loading",

        message:
          "Transaction sent. Waiting for blockchain confirmation...",

        transactionHash:
          transaction.hash,
      });


      // ------------------------------
      // WAIT FOR BLOCKCHAIN
      // ------------------------------

      const receipt =
        await transaction.wait();


      // ------------------------------
      // SUCCESS
      // ------------------------------

      setMintResult({
        type: "success",

        message:
          "Digital asset successfully minted on the blockchain.",

        transactionHash:
          transaction.hash,

        blockNumber:
          receipt.blockNumber,
      });


      // ------------------------------
      // AUDIT TRAIL
      // ------------------------------

      if (addActivity) {

        addActivity(
          "Digital Asset",

          `Asset minted to ${recipientAddress}`,

          walletAddress
        );

      }


      // ------------------------------
      // CLEAR FORM
      // ------------------------------

      setRecipientAddress("");

      setMetadataCID("");

    } catch (error) {

      console.error(
        "Mint Asset Error:",
        error
      );


      let errorMessage =
        "Failed to mint digital asset.";


      if (error.reason) {

        errorMessage =
          error.reason;

      }


      if (error.shortMessage) {

        errorMessage =
          error.shortMessage;

      }


      setMintResult({
        type: "error",

        message:
          errorMessage,
      });

    } finally {

      setIsMinting(false);

    }

  };


  // ==========================================
  // CHECK ASSET
  // ==========================================

  const checkAsset = async () => {

    try {

      setAssetOwner("");

      setAssetMetadata(null);


      if (!assetTokenId) {

        alert(
          "Please enter an Asset Token ID."
        );

        return;

      }


      if (
        Number(assetTokenId) <= 0
      ) {

        alert(
          "Token ID must be greater than 0."
        );

        return;

      }


      setIsCheckingAsset(true);


      const {
        assetContract,
      } =
        await getContracts();


      // ------------------------------
      // GET OWNER
      // ------------------------------

      const owner =
        await assetContract.ownerOf(
          assetTokenId
        );


      // ------------------------------
      // GET METADATA
      // ------------------------------

      const asset =
        await assetContract.assets(
          assetTokenId
        );


      setAssetOwner(
        owner
      );


      setAssetMetadata({
        metadataCID:
          asset.metadataCID,

        mintedAt:
          new Date(
            Number(asset.mintedAt) *
              1000
          ).toLocaleString(),
      });


    } catch (error) {

      console.error(
        "Check Asset Error:",
        error
      );


      alert(
        "Asset not found. Please check the Token ID."
      );


    } finally {

      setIsCheckingAsset(false);

    }

  };


  // ==========================================
  // CHECK WALLET ASSET BALANCE
  // ==========================================

  const checkWalletAssets = async () => {

    try {

      if (!isConnected) {

        alert(
          "Please connect your wallet first."
        );

        return;

      }


      setIsCheckingBalance(true);


      const {
        assetContract,
      } =
        await getContracts();


      const balance =
        await assetContract.balanceOf(
          walletAddress
        );


      setWalletBalance(
        balance.toString()
      );


    } catch (error) {

      console.error(
        "Balance Error:",
        error
      );


      alert(
        "Failed to check wallet assets."
      );


    } finally {

      setIsCheckingBalance(false);

    }

  };


  // ==========================================
  // SHORT ADDRESS
  // ==========================================

  const shortenAddress = (
    address
  ) => {

    if (!address) {

      return "";

    }


    return `${address.slice(
      0,
      8
    )}...${address.slice(-6)}`;

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <section className="dashboard">


      {/* TITLE */}

      <div className="section-title">

        <h2>
          💎 Digital Asset Vault
        </h2>

        <p>
          Mint and manage blockchain-based
          digital assets using the AssetNFT
          smart contract.
        </p>

      </div>


      {/* CONTRACT STATUS */}

      <div
        className="wallet-status"
        style={{
          marginBottom: "2rem",
        }}
      >

        <strong>
          ⛓️ AssetNFT Smart Contract
        </strong>

        <p>
          {CONTRACT_ADDRESSES.AssetNFT}
        </p>

      </div>


      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap: "1.5rem",
        }}
      >


        {/* MINT ASSET */}

        <div className="service-card">

          <div className="card-icon">
            💎
          </div>

          <h3>
            Mint Digital Asset
          </h3>

          <p>
            Create a new blockchain asset NFT
            for a verified identity.
          </p>


          <input
            type="text"

            className="transaction-input"

            placeholder="Recipient wallet address"

            value={recipientAddress}

            onChange={(event) =>
              setRecipientAddress(
                event.target.value
              )
            }
          />


          <input
            type="text"

            className="transaction-input"

            placeholder="Asset metadata or CID"

            value={metadataCID}

            onChange={(event) =>
              setMetadataCID(
                event.target.value
              )
            }
          />


          <button
            className="card-btn"

            onClick={mintAsset}

            disabled={isMinting}
          >

            {isMinting
              ? "Minting..."
              : "Mint Asset on Blockchain →"}

          </button>


          {/* MINT RESULT */}

          {mintResult && (

            <div
              className={`verification-result ${mintResult.type}`}
            >

              <h3>

                {mintResult.type ===
                "success"
                  ? "✓ Asset Minted"
                  : mintResult.type ===
                    "error"
                  ? "⚠ Mint Failed"
                  : "⏳ Processing"}

              </h3>


              <p>
                {mintResult.message}
              </p>


              {mintResult.transactionHash && (

                <div className="hash-result">

                  <strong>
                    Transaction Hash:
                  </strong>

                  <p
                    style={{
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {mintResult.transactionHash}
                  </p>

                </div>

              )}


              {mintResult.blockNumber && (

                <p>

                  <strong>
                    Block:
                  </strong>

                  {" "}

                  {mintResult.blockNumber}

                </p>

              )}

            </div>

          )}

        </div>


        {/* CHECK ASSET */}

        <div className="service-card">

          <div className="card-icon">
            🔍
          </div>

          <h3>
            Verify Asset
          </h3>

          <p>
            Search a digital asset directly
            from the blockchain.
          </p>


          <input
            type="number"

            className="transaction-input"

            placeholder="Enter Asset Token ID"

            value={assetTokenId}

            onChange={(event) =>
              setAssetTokenId(
                event.target.value
              )
            }
          />


          <button
            className="card-btn"

            onClick={checkAsset}

            disabled={isCheckingAsset}
          >

            {isCheckingAsset
              ? "Checking..."
              : "Check Asset →"}

          </button>


          {assetOwner && (

            <div
              className="verification-result success"
            >

              <h3>
                ✓ Asset Found
              </h3>


              <p>

                <strong>
                  Owner:
                </strong>

              </p>

              <p
                style={{
                  wordBreak:
                    "break-all",
                }}
              >
                {assetOwner}
              </p>


              <p>

                <strong>
                  Metadata:
                </strong>

              </p>

              <p>
                {assetMetadata?.metadataCID}
              </p>


              <p>

                <strong>
                  Minted:
                </strong>

              </p>

              <p>
                {assetMetadata?.mintedAt}
              </p>

            </div>

          )}

        </div>


        {/* WALLET ASSETS */}

        <div className="service-card">

          <div className="card-icon">
            👛
          </div>

          <h3>
            My Digital Assets
          </h3>

          <p>
            Check how many AssetNFT tokens
            are owned by your wallet.
          </p>


          <p
            style={{
              marginTop:
                "1rem",

              color:
                "var(--text-muted)",
            }}
          >

            Wallet:

            {" "}

            {isConnected
              ? shortenAddress(
                  walletAddress
                )
              : "Not Connected"}

          </p>


          <button
            className="card-btn"

            onClick={
              checkWalletAssets
            }

            disabled={
              isCheckingBalance
            }
          >

            {isCheckingBalance
              ? "Checking..."
              : "Check My Assets →"}

          </button>


          {walletBalance !== null && (

            <div
              className="verification-result success"
            >

              <h3>
                💎 Asset Balance
              </h3>

              <div
                style={{
                  fontSize:
                    "3rem",

                  fontWeight:
                    "bold",

                  margin:
                    "1rem 0",
                }}
              >

                {walletBalance}

              </div>

              <p>
                AssetNFT token(s) owned
                by this wallet.
              </p>

            </div>

          )}

        </div>


      </div>


      {/* SECURITY INFORMATION */}

      <div
        className="service-card"

        style={{
          marginTop:
            "2rem",
        }}
      >

        <h3>
          🔐 Asset Security
        </h3>


        <p>

          ApexChain AssetNFT assets are
          protected by blockchain-based
          identity verification.

        </p>


        <div
          style={{
            marginTop:
              "1rem",

            display:
              "grid",

            gap:
              "0.8rem",
          }}
        >

          <p>
            ✓ Only verified identities can
            receive assets.
          </p>

          <p>
            ✓ Asset ownership is stored on
            the blockchain.
          </p>

          <p>
            ✓ Asset metadata is linked to
            the smart contract.
          </p>

          <p>
            ✓ Transactions require MetaMask
            confirmation.
          </p>

        </div>

      </div>


    </section>

  );

}


export default DigitalAssets;