import { useState } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "../blockchain/provider.js";
import { getContract } from "../blockchain/contracts.js";

function Identity({ walletAddress, isConnected }) {
  const [identityAddress, setIdentityAddress] = useState("");
  const [cid, setCid] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [identityResult, setIdentityResult] = useState(null);

  const addressToCheck = identityAddress.trim() || walletAddress || "";

  const issueIdentity = async () => {
    try {
      if (!isConnected) throw new Error("Please connect MetaMask first.");
      if (!ethers.isAddress(identityAddress)) throw new Error("Enter a valid wallet address.");
      if (!cid.trim()) throw new Error("Enter a document CID/reference.");
      if (!documentText.trim()) throw new Error("Enter the document content.");

      setIsLoading(true);
      setStatus("Preparing blockchain transaction...");
      const contract = getContract("IdentityRegistry", await getSigner());
      const documentHash = ethers.keccak256(ethers.toUtf8Bytes(documentText));

      setStatus("Waiting for MetaMask confirmation...");
      const tx = await contract.issueIdentity(identityAddress, cid.trim(), documentHash);
      setStatus("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();

      setIdentityResult({
        address: identityAddress,
        cid: cid.trim(),
        documentHash,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
      });
      setStatus("Identity successfully issued on the blockchain.");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIdentity = async () => {
    try {
      if (!ethers.isAddress(addressToCheck)) throw new Error("Enter a valid wallet address.");
      setIsLoading(true);
      const contract = getContract("IdentityRegistry", getProvider());
      const tokenId = await contract.identityOf(addressToCheck);
      if (tokenId === 0n) {
        setIdentityResult({ address: addressToCheck, valid: "No identity" });
        setStatus("No blockchain identity exists for this wallet.");
        return;
      }

      const valid = await contract.hasValidIdentity(addressToCheck);
      const data = await contract.identities(tokenId);
      setIdentityResult({
        address: addressToCheck,
        tokenId: tokenId.toString(),
        valid: valid ? "Valid" : "Revoked",
        cid: data.didDocumentCID,
        documentHash: data.docHash,
        issuedBy: data.issuedBy,
        issuedAt: new Date(Number(data.issuedAt) * 1000).toLocaleString(),
      });
      setStatus(valid ? "Valid identity found on blockchain." : "Identity exists but has been revoked.");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDocument = async () => {
    try {
      if (!ethers.isAddress(addressToCheck)) throw new Error("Enter a valid wallet address.");
      if (!documentText.trim()) throw new Error("Enter the document content to verify.");
      setIsLoading(true);
      const contract = getContract("IdentityRegistry", getProvider());
      const tokenId = await contract.identityOf(addressToCheck);
      if (tokenId === 0n) throw new Error("No identity exists for this wallet.");

      const matches = await contract.verifyDocument(tokenId, ethers.toUtf8Bytes(documentText));
      const hash = ethers.keccak256(ethers.toUtf8Bytes(documentText));
      setIdentityResult((previous) => ({
        ...(previous || {}),
        address: addressToCheck,
        tokenId: tokenId.toString(),
        documentHash: hash,
        documentMatch: matches,
      }));
      setStatus(matches ? "Document matches the hash stored on-chain." : "Document does NOT match the on-chain hash.");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeIdentity = async () => {
    try {
      if (!identityResult?.tokenId) throw new Error("Check an identity first.");
      setIsLoading(true);
      setStatus("Waiting for MetaMask confirmation...");
      const contract = getContract("IdentityRegistry", await getSigner());
      const tx = await contract.revokeIdentity(identityResult.tokenId);
      await tx.wait();
      setIdentityResult((previous) => ({ ...previous, valid: "Revoked", transactionHash: tx.hash }));
      setStatus("Identity revoked on the blockchain.");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = { width: "100%", marginTop: "0.8rem" };

  return (
    <section className="dashboard">
      <div className="section-title">
        <h2>Decentralized Identity</h2>
        <p>Issue, verify, cryptographically verify documents, and revoke blockchain identities.</p>
      </div>

      <div className="wallet-status" style={{ marginBottom: "2rem" }}>
        <strong>Connected Wallet</strong>
        <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{isConnected ? walletAddress : "Wallet not connected"}</p>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🪪</div>
        <h3>Issue Identity</h3>
        <p>Creates an ERC-721-based, non-transferable identity and stores the document hash and reference on-chain.</p>
        <input className="transaction-input" style={inputStyle} placeholder="Wallet address" value={identityAddress} onChange={(e) => setIdentityAddress(e.target.value)} />
        <input className="transaction-input" style={inputStyle} placeholder="Document CID / reference (e.g. ipfs://...)" value={cid} onChange={(e) => setCid(e.target.value)} />
        <textarea className="transaction-input" style={inputStyle} rows="5" placeholder="Document content — its keccak256 hash is stored on-chain" value={documentText} onChange={(e) => setDocumentText(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={issueIdentity} disabled={isLoading}>Issue Identity</button>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🔍</div>
        <h3>Verify Identity</h3>
        <p>Reads the identity token and revocation status directly from IdentityRegistry.</p>
        <input className="transaction-input" style={inputStyle} placeholder="Wallet address (blank = connected wallet)" value={identityAddress} onChange={(e) => setIdentityAddress(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={checkIdentity} disabled={isLoading}>Check On-Chain Identity</button>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🔐</div>
        <h3>Verify Document Integrity</h3>
        <p>Hashes the supplied document and compares it with the immutable document hash stored in the identity record.</p>
        <input className="transaction-input" style={inputStyle} placeholder="Wallet address (blank = connected wallet)" value={identityAddress} onChange={(e) => setIdentityAddress(e.target.value)} />
        <textarea className="transaction-input" style={inputStyle} rows="5" placeholder="Paste the exact document content" value={documentText} onChange={(e) => setDocumentText(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={verifyDocument} disabled={isLoading}>Verify Document Hash</button>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🚫</div>
        <h3>Revoke Identity</h3>
        <p>Manager-only blockchain operation. A revoked identity can no longer receive assets.</p>
        <button className="card-btn" onClick={revokeIdentity} disabled={isLoading || !identityResult?.tokenId}>Revoke Identity</button>
      </div>

      {status && <div className="wallet-status" style={{ marginBottom: "1.5rem" }}><strong>Blockchain Result</strong><p style={{ marginTop: "0.5rem", wordBreak: "break-word" }}>{status}</p></div>}

      {identityResult && (
        <div className="service-card">
          <h3>On-Chain Identity Record</h3>
          {Object.entries(identityResult).map(([key, value]) => value !== undefined && key !== "documentMatch" ? (
            <p key={key} style={{ marginTop: "0.7rem", wordBreak: "break-all" }}><strong>{key}:</strong> {String(value)}</p>
          ) : null)}
          {identityResult.documentMatch !== undefined && (
            <p style={{ marginTop: "0.8rem", fontWeight: "bold" }}>{identityResult.documentMatch ? "✓ Document hash matches" : "✗ Document hash does not match"}</p>
          )}
        </div>
      )}
    </section>
  );
}

export default Identity;
