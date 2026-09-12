import { useState } from "react";
import { ethers } from "ethers";

import { getSigner, getProvider } from "../blockchain/provider";
import {
  IdentityRegistryABI,
} from "../blockchain/contracts";

import {
  CONTRACT_ADDRESSES,
} from "../blockchain/addresses";


function Identity({ walletAddress, isConnected }) {

  const [identityAddress, setIdentityAddress] =
    useState("");

  const [cid, setCid] =
    useState("");

  const [documentText, setDocumentText] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [identityResult, setIdentityResult] =
    useState(null);


  // ==========================================
  // GET CONTRACT WITH SIGNER
  // ==========================================

  const getIdentityContract = async () => {

    const signer =
      await getSigner();

    return new ethers.Contract(
      CONTRACT_ADDRESSES.IdentityRegistry,
      IdentityRegistryABI,
      signer
    );
  };


  // ==========================================
  // ISSUE IDENTITY
  // ==========================================

  const issueIdentity = async () => {

    try {

      if (!isConnected) {

        setStatus(
          "❌ Please connect your wallet first."
        );

        return;
      }


      if (
        !ethers.isAddress(identityAddress)
      ) {

        setStatus(
          "❌ Please enter a valid wallet address."
        );

        return;
      }


      if (!cid.trim()) {

        setStatus(
          "❌ Please enter a Document CID."
        );

        return;
      }


      if (!documentText.trim()) {

        setStatus(
          "❌ Please enter document content."
        );

        return;
      }


      setIsLoading(true);

      setStatus(
        "⏳ Preparing blockchain transaction..."
      );


      const contract =
        await getIdentityContract();


      // CREATE DOCUMENT HASH

      const documentBytes =
        ethers.toUtf8Bytes(
          documentText
        );


      const documentHash =
        ethers.keccak256(
          documentBytes
        );


      setStatus(
        "⏳ Sending transaction to MetaMask..."
      );


      const transaction =
        await contract.issueIdentity(
          identityAddress,
          cid,
          documentHash
        );


      setStatus(
        "⏳ Transaction sent. Waiting for confirmation..."
      );


      await transaction.wait();


      setStatus(
        "✅ Identity successfully issued on blockchain!"
      );


      setIdentityResult({
        address:
          identityAddress,

        cid:
          cid,

        documentHash:
          documentHash,

        transactionHash:
          transaction.hash,
      });


    } catch (error) {

      console.error(error);


      setStatus(
        `❌ ${
          error.reason ||
          error.shortMessage ||
          error.message
        }`
      );

    } finally {

      setIsLoading(false);

    }

  };


  // ==========================================
  // CHECK IDENTITY
  // ==========================================

  const checkIdentity = async () => {

    try {

      if (
        !ethers.isAddress(identityAddress)
      ) {

        setStatus(
          "❌ Enter a valid wallet address first."
        );

        return;

      }


      setIsLoading(true);


      const provider =
        getProvider();


      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESSES.IdentityRegistry,
          IdentityRegistryABI,
          provider
        );


      const tokenId =
        await contract.identityOf(
          identityAddress
        );


      const valid =
        await contract.hasValidIdentity(
          identityAddress
        );


      if (tokenId === 0n) {

        setStatus(
          "❌ No identity found for this wallet."
        );

        setIdentityResult(null);

      } else {

        setStatus(
          valid
            ? "✅ Valid identity found!"
            : "⚠️ Identity exists but has been revoked."
        );


        setIdentityResult({

          address:
            identityAddress,

          tokenId:
            tokenId.toString(),

          valid:

            valid
              ? "Valid"
              : "Revoked",

        });

      }


    } catch (error) {

      console.error(error);


      setStatus(
        `❌ ${
          error.shortMessage ||
          error.message
        }`
      );

    } finally {

      setIsLoading(false);

    }

  };


  // ==========================================
  // REVOKE IDENTITY
  // ==========================================

  const revokeIdentity = async () => {

    try {

      if (!identityResult?.tokenId) {

        setStatus(
          "❌ Check an identity first."
        );

        return;

      }


      setIsLoading(true);


      setStatus(
        "⏳ Sending revoke transaction..."
      );


      const contract =
        await getIdentityContract();


      const transaction =
        await contract.revokeIdentity(
          identityResult.tokenId
        );


      await transaction.wait();


      setStatus(
        "✅ Identity revoked successfully!"
      );


      setIdentityResult({
        ...identityResult,

        valid:
          "Revoked",

        transactionHash:
          transaction.hash,

      });


    } catch (error) {

      console.error(error);


      setStatus(
        `❌ ${
          error.reason ||
          error.shortMessage ||
          error.message
        }`
      );

    } finally {

      setIsLoading(false);

    }

  };


  return (

    <section className="dashboard">


      <div className="section-title">

        <h2>
          Decentralized Identity
        </h2>

        <p>
          Issue, verify and revoke
          blockchain-based identities.
        </p>

      </div>


      {/* WALLET STATUS */}

      <div
        className="service-card"
        style={{
          marginBottom: "2rem",
        }}
      >

        <h3>
          👛 Connected Wallet
        </h3>


        <p>

          {isConnected
            ? walletAddress
            : "Wallet not connected"}

        </p>

      </div>


      {/* ISSUE IDENTITY */}

      <div
        className="service-card"
        style={{
          marginBottom: "2rem",
        }}
      >

        <div className="card-icon">
          🪪
        </div>


        <h3>
          Issue Identity
        </h3>


        <p>
          Create a permanent decentralized
          identity on the blockchain.
        </p>


        <input
          className="transaction-input"

          placeholder="Wallet Address"

          value={identityAddress}

          onChange={(event) =>
            setIdentityAddress(
              event.target.value
            )
          }
        />


        <input
          className="transaction-input"

          placeholder="Document CID (example: ipfs://...)"

          value={cid}

          onChange={(event) =>
            setCid(
              event.target.value
            )
          }
        />


        <textarea
          className="transaction-input"

          placeholder="Document Content"

          value={documentText}

          onChange={(event) =>
            setDocumentText(
              event.target.value
            )
          }

          rows="4"
        />


        <button
          className="card-btn"

          onClick={issueIdentity}

          disabled={isLoading}
        >

          {isLoading
            ? "Processing..."
            : "Issue Identity on Blockchain"}

        </button>

      </div>


      {/* CHECK IDENTITY */}

      <div
        className="service-card"
        style={{
          marginBottom: "2rem",
        }}
      >

        <div className="card-icon">
          🔍
        </div>


        <h3>
          Verify Identity
        </h3>


        <p>
          Check whether a wallet has
          a valid blockchain identity.
        </p>


        <button
          className="card-btn"

          onClick={checkIdentity}

          disabled={isLoading}
        >

          Check Identity

        </button>

      </div>


      {/* REVOKE */}

      <div
        className="service-card"
        style={{
          marginBottom: "2rem",
        }}
      >

        <div className="card-icon">
          🚫
        </div>


        <h3>
          Revoke Identity
        </h3>


        <p>
          Revoke the selected
          blockchain identity.
        </p>


        <button
          className="card-btn"

          onClick={revokeIdentity}

          disabled={
            isLoading ||
            !identityResult?.tokenId
          }
        >

          Revoke Identity

        </button>

      </div>


      {/* STATUS */}

      {status && (

        <div
          className="service-card"
          style={{
            marginBottom: "2rem",
          }}
        >

          <h3>
            Blockchain Status
          </h3>

          <p>
            {status}
          </p>

        </div>

      )}


      {/* RESULT */}

      {identityResult && (

        <div
          className="service-card"
        >

          <h3>
            Identity Result
          </h3>


          <p>

            <strong>
              Wallet:
            </strong>

            <br />

            {identityResult.address}

          </p>


          {identityResult.tokenId && (

            <p>

              <strong>
                Token ID:
              </strong>

              {" "}

              {identityResult.tokenId}

            </p>

          )}


          {identityResult.cid && (

            <p>

              <strong>
                CID:
              </strong>

              {" "}

              {identityResult.cid}

            </p>

          )}


          {identityResult.documentHash && (

            <p>

              <strong>
                Document Hash:
              </strong>

              <br />

              {identityResult.documentHash}

            </p>

          )}


          {identityResult.valid && (

            <p>

              <strong>
                Status:
              </strong>

              {" "}

              {identityResult.valid}

            </p>

          )}


          {identityResult.transactionHash && (

            <p>

              <strong>
                Transaction:
              </strong>

              <br />

              {identityResult.transactionHash}

            </p>

          )}

        </div>

      )}


    </section>

  );

}


export default Identity;