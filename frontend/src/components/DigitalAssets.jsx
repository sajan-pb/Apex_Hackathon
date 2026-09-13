import { useState } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "../blockchain/provider.js";
import { getContract } from "../blockchain/contracts.js";
import { CONTRACT_ADDRESSES } from "../blockchain/addresses.js";

function DigitalAssets({ walletAddress, isConnected }) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [metadataCID, setMetadataCID] = useState("");
  const [mintResult, setMintResult] = useState(null);
  const [assetTokenId, setAssetTokenId] = useState("");
  const [assetOwner, setAssetOwner] = useState("");
  const [assetMetadata, setAssetMetadata] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [transferTokenId, setTransferTokenId] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferResult, setTransferResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const mintAsset = async () => {
    try {
      if (!isConnected) throw new Error("Connect MetaMask first.");
      if (!ethers.isAddress(recipientAddress)) throw new Error("Enter a valid recipient address.");
      if (!metadataCID.trim()) throw new Error("Enter asset metadata/CID.");
      setLoading(true); setMintResult(null);
      const signer = await getSigner();
      const identity = getContract("IdentityRegistry", signer);
      const asset = getContract("AssetNFT", signer);
      if (!(await identity.hasValidIdentity(recipientAddress))) throw new Error("Recipient has no valid identity. The smart contract blocks this mint.");
      const tx = await asset.mintTo(recipientAddress, metadataCID.trim());
      const receipt = await tx.wait();
      setMintResult({ type: "success", message: "Asset minted on-chain.", transactionHash: tx.hash, blockNumber: receipt.blockNumber });
      setRecipientAddress(""); setMetadataCID("");
    } catch (error) {
      console.error(error);
      setMintResult({ type: "error", message: error.reason || error.shortMessage || error.message });
    } finally { setLoading(false); }
  };

  const checkAsset = async () => {
    try {
      if (!assetTokenId || Number(assetTokenId) <= 0) throw new Error("Enter a valid token ID.");
      setLoading(true); setAssetOwner(""); setAssetMetadata(null);
      const asset = getContract("AssetNFT", getProvider());
      const owner = await asset.ownerOf(assetTokenId);
      const data = await asset.assets(assetTokenId);
      setAssetOwner(owner);
      setAssetMetadata({ metadataCID: data.metadataCID, mintedAt: new Date(Number(data.mintedAt) * 1000).toLocaleString() });
    } catch (error) {
      console.error(error); setAssetOwner(""); setAssetMetadata(null); alert(error.shortMessage || error.message || "Asset not found.");
    } finally { setLoading(false); }
  };

  const checkWalletAssets = async () => {
    try {
      if (!isConnected) throw new Error("Connect MetaMask first.");
      setLoading(true);
      const asset = getContract("AssetNFT", getProvider());
      setWalletBalance((await asset.balanceOf(walletAddress)).toString());
    } catch (error) { alert(error.shortMessage || error.message); }
    finally { setLoading(false); }
  };

  const transferAsset = async () => {
    try {
      if (!isConnected) throw new Error("Connect MetaMask first.");
      if (!transferTokenId || Number(transferTokenId) <= 0) throw new Error("Enter a valid token ID.");
      if (!ethers.isAddress(transferRecipient)) throw new Error("Enter a valid recipient address.");
      setLoading(true); setTransferResult(null);
      const provider = getProvider();
      const readAsset = getContract("AssetNFT", provider);
      const owner = await readAsset.ownerOf(transferTokenId);
      const signer = await getSigner();
      const sender = await signer.getAddress();
      if (owner.toLowerCase() !== sender.toLowerCase()) throw new Error("Connected wallet is not the owner of this NFT.");
      const identity = getContract("IdentityRegistry", provider);
      if (!(await identity.hasValidIdentity(transferRecipient))) throw new Error("Recipient has no valid identity. The AssetNFT contract will block this transfer.");
      const asset = getContract("AssetNFT", signer);
      const tx = await asset.transferFrom(sender, transferRecipient, transferTokenId);
      const receipt = await tx.wait();
      setTransferResult({ type: "success", message: "Asset ownership transferred on-chain.", transactionHash: tx.hash, blockNumber: receipt.blockNumber, recipient: transferRecipient });
    } catch (error) {
      console.error(error); setTransferResult({ type: "error", message: error.reason || error.shortMessage || error.message });
    } finally { setLoading(false); }
  };

  const shorten = (address) => address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "";

  return (
    <section className="dashboard">
      <div className="section-title">
        <h2>Digital Asset Vault</h2>
        <p>Real ERC-721 assets governed by identity validation and blockchain ownership.</p>
      </div>

      <div className="wallet-status" style={{ marginBottom: "2rem" }}>
        <strong>AssetNFT Contract</strong>
        <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{CONTRACT_ADDRESSES.AssetNFT}</p>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">💎</div>
        <h3>Mint Digital Asset</h3>
        <p>Only a wallet with MANAGER_ROLE can mint, and the smart contract requires the recipient to have a valid identity.</p>
        <input className="transaction-input" style={{ width: "100%", marginTop: "0.8rem" }} placeholder="Recipient wallet address" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
        <input className="transaction-input" style={{ width: "100%", marginTop: "0.8rem" }} placeholder="Asset metadata CID/reference" value={metadataCID} onChange={(e) => setMetadataCID(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={mintAsset} disabled={loading}>Mint Asset</button>
        {mintResult && <div className={`verification-result ${mintResult.type}`} style={{ marginTop: "1rem" }}><strong>{mintResult.type === "success" ? "✓ Success" : "✗ Blocked"}</strong><p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{mintResult.message}</p>{mintResult.transactionHash && <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>Transaction: {mintResult.transactionHash}</p>}</div>}
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">↔️</div>
        <h3>Transfer Asset</h3>
        <p>The current owner can transfer an NFT, but AssetNFT will reject any recipient without a valid identity.</p>
        <input className="transaction-input" style={{ width: "100%", marginTop: "0.8rem" }} type="number" min="1" placeholder="Asset Token ID" value={transferTokenId} onChange={(e) => setTransferTokenId(e.target.value)} />
        <input className="transaction-input" style={{ width: "100%", marginTop: "0.8rem" }} placeholder="Recipient wallet address" value={transferRecipient} onChange={(e) => setTransferRecipient(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={transferAsset} disabled={loading}>Transfer Asset</button>
        {transferResult && <div className={`verification-result ${transferResult.type}`} style={{ marginTop: "1rem" }}><strong>{transferResult.type === "success" ? "✓ Transfer Successful" : "✗ Transfer Blocked"}</strong><p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{transferResult.message}</p>{transferResult.transactionHash && <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>Transaction: {transferResult.transactionHash}</p>}</div>}
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🔍</div>
        <h3>Verify Asset Ownership</h3>
        <p>Read the owner and metadata directly from AssetNFT.</p>
        <input className="transaction-input" style={{ width: "100%", marginTop: "0.8rem" }} type="number" min="1" placeholder="Asset Token ID" value={assetTokenId} onChange={(e) => setAssetTokenId(e.target.value)} />
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={checkAsset} disabled={loading}>Read Asset From Blockchain</button>
        {assetOwner && <div className="verification-result success" style={{ marginTop: "1rem" }}><strong>✓ Asset exists</strong><p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>Owner: {assetOwner}</p><p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>Metadata: {assetMetadata?.metadataCID}</p><p style={{ marginTop: "0.5rem" }}>Minted: {assetMetadata?.mintedAt}</p></div>}
      </div>

      <div className="service-card">
        <div className="card-icon">👛</div>
        <h3>My Asset Balance</h3>
        <p>{isConnected ? `Connected wallet: ${shorten(walletAddress)}` : "Connect MetaMask to check your balance."}</p>
        <button className="card-btn" style={{ marginTop: "1rem" }} onClick={checkWalletAssets} disabled={loading}>Check On-Chain Balance</button>
        {walletBalance !== null && <div className="verification-result success" style={{ marginTop: "1rem" }}><strong>{walletBalance} AssetNFT token(s)</strong></div>}
      </div>
    </section>
  );
}

export default DigitalAssets;
