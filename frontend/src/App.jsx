import { useState } from "react";
import { connectToBlockchain } from "./blockchain/provider.js";
import Navbar from "./components/Navbar.jsx";
import Identity from "./components/Identity.jsx";
import DigitalAssets from "./components/DigitalAssets.jsx";
import AccessControl from "./components/AccessControl.jsx";
import AuditTrail from "./components/AuditTrail.jsx";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const { walletAddress: address } = await connectToBlockchain();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to connect MetaMask.");
    }
  };

  const Dashboard = () => (
    <main className="dashboard">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">⛓️ Blockchain Security Platform</div>
          <h1>Secure Digital Identity, Access and Assets with <span>ApexChain</span></h1>
          <p>A blockchain-based platform where smart contracts enforce identity, role permissions and NFT ownership.</p>
          <div className="hero-buttons">
            <button className="hero-button" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>Explore Platform →</button>
            <button className="card-btn" onClick={connectWallet}>{isConnected ? "Wallet Connected" : "Connect Wallet"}</button>
          </div>
        </div>
      </section>

      {isConnected && <div className="wallet-status"><strong>Blockchain Wallet</strong><p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{walletAddress}</p></div>}

      <section id="services" className="services-section">
        <div className="section-title"><h2>Core Platform</h2><p>Every core service below interacts with the deployed smart contracts.</p></div>
        <div className="services-grid">
          <div className="service-card"><div className="card-icon">🪪</div><h3>Decentralized Identity</h3><p>Issue, verify, cryptographically verify documents and revoke identities.</p><button className="card-btn" onClick={() => setCurrentPage("identity")}>Manage Identity →</button></div>
          <div className="service-card"><div className="card-icon">💎</div><h3>Digital Asset Vault</h3><p>Mint, inspect and transfer ERC-721 assets subject to identity validation.</p><button className="card-btn" onClick={() => setCurrentPage("assets")}>Manage Assets →</button></div>
          <div className="service-card"><div className="card-icon">🔐</div><h3>Role-Based Access Control</h3><p>Manage on-chain roles through the 2-of-3 multisig governance contract.</p><button className="card-btn" onClick={() => setCurrentPage("access")}>Manage RBAC →</button></div>
          <div className="service-card"><div className="card-icon">📜</div><h3>Blockchain Audit Trail</h3><p>Read immutable Identity, Asset and Multisig events directly from the blockchain.</p><button className="card-btn" onClick={() => setCurrentPage("audit")}>View Audit Trail →</button></div>
        </div>
      </section>
    </main>
  );

  let page;
  switch (currentPage) {
    case "identity": page = <Identity walletAddress={walletAddress} isConnected={isConnected} />; break;
    case "assets": page = <DigitalAssets walletAddress={walletAddress} isConnected={isConnected} />; break;
    case "access": page = <AccessControl walletAddress={walletAddress} isConnected={isConnected} />; break;
    case "audit": page = <AuditTrail isConnected={isConnected} />; break;
    default: page = <Dashboard />;
  }

  return <div className="app"><Navbar isConnected={isConnected} walletAddress={walletAddress} connectWallet={connectWallet} setCurrentPage={setCurrentPage} />{page}</div>;
}

export default App;
