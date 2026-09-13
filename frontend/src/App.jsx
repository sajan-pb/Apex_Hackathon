import { useState } from "react";
import { connectToBlockchain } from "./blockchain/provider.js";

import Navbar from "./components/Navbar.jsx";
import Identity from "./components/Identity.jsx";
import DigitalAssets from "./components/DigitalAssets.jsx";
import AccessControl from "./components/AccessControl.jsx";
import AuditTrail from "./components/AuditTrail.jsx";
import SecurityMonitoring from "./components/SecurityMonitoring.jsx";
import TransactionVerification from "./components/TransactionVerification.jsx";
import BlockchainExplorer from "./components/BlockchainExplorer.jsx";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "System",
      action: "Blockchain security system initialized",
      user: "System",
      time: new Date().toLocaleString(),
      status: "Success",
    },
  ]);

  // ==============================
  // CONNECT METAMASK — now forces the Hardhat local network first,
  // instead of silently connecting on whatever network MetaMask happens to be on.
  // ==============================

  const connectWallet = async () => {
    try {
      const { walletAddress: address } = await connectToBlockchain();

      setWalletAddress(address);
      setIsConnected(true);

      addActivity("Wallet", "MetaMask wallet connected successfully", address);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to connect MetaMask wallet.");
    }
  };

  // ==============================
  // ADD AUDIT ACTIVITY
  // ==============================

  const addActivity = (type, action, user = walletAddress || "System") => {
    const newActivity = {
      id: Date.now() + Math.random(),
      type,
      action,
      user,
      time: new Date().toLocaleString(),
      status: "Success",
    };

    setActivities((previousActivities) => [newActivity, ...previousActivities]);
  };

  // ==============================
  // CLEAR ACTIVITIES
  // ==============================

  const clearActivities = () => {
    setActivities([]);
  };

  // ==============================
  // DASHBOARD
  // ==============================

  const Dashboard = () => {
    return (
      <main className="dashboard">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">⛓️ Blockchain Security Platform</div>

            <h1>
              Secure Your Digital World With
              <span> ApexChain</span>
            </h1>

            <p>
              A blockchain-powered cybersecurity platform for digital identity, asset management,
              access control, transaction verification and security monitoring.
            </p>

            <div className="hero-buttons">
              <button
                className="hero-button"
                onClick={() =>
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Services →
              </button>

              <button className="card-btn" onClick={connectWallet}>
                {isConnected ? "🟢 Wallet Connected" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </section>

        {isConnected && (
          <div className="wallet-status">
            <strong>🟢 Blockchain Wallet Connected</strong>
            <p>{walletAddress}</p>
          </div>
        )}

        <section id="services" className="services-section">
          <div className="section-title">
            <h2>Platform Services</h2>
            <p>Explore blockchain-powered security tools.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="card-icon">🪪</div>
              <h3>Identity Management</h3>
              <p>Register and verify secure blockchain-based digital identities.</p>
              <button className="card-btn" onClick={() => setCurrentPage("identity")}>
                Manage Identity →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">💎</div>
              <h3>Digital Asset Vault</h3>
              <p>Create and securely manage blockchain-based digital assets.</p>
              <button className="card-btn" onClick={() => setCurrentPage("assets")}>
                Manage Assets →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">🔐</div>
              <h3>Access Control</h3>
              <p>Assign roles and manage blockchain access permissions.</p>
              <button className="card-btn" onClick={() => setCurrentPage("access")}>
                Manage Access →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">🔍</div>
              <h3>Transaction Verification</h3>
              <p>Verify blockchain transaction hashes securely.</p>
              <button className="card-btn" onClick={() => setCurrentPage("transaction")}>
                Verify Transaction →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">⛓️</div>
              <h3>Blockchain Explorer</h3>
              <p>Search blockchain transactions, wallets and block information.</p>
              <button className="card-btn" onClick={() => setCurrentPage("explorer")}>
                Explore Blockchain →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">🛡️</div>
              <h3>Security Monitoring</h3>
              <p>Monitor blockchain security and system protection.</p>
              <button className="card-btn" onClick={() => setCurrentPage("security")}>
                View Security →
              </button>
            </div>

            <div className="service-card">
              <div className="card-icon">📜</div>
              <h3>Audit Trail</h3>
              <p>Monitor and verify important blockchain activities and events.</p>
              <button className="card-btn" onClick={() => setCurrentPage("audit")}>
                View Audit Trail →
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  };

  // ==============================
  // PAGE RENDERING
  // ==============================

  const renderPage = () => {
    switch (currentPage) {
      case "identity":
        return <Identity walletAddress={walletAddress} isConnected={isConnected} addActivity={addActivity} />;

      case "assets":
        return <DigitalAssets walletAddress={walletAddress} isConnected={isConnected} addActivity={addActivity} />;

      case "access":
        return <AccessControl walletAddress={walletAddress} isConnected={isConnected} addActivity={addActivity} />;

      case "audit":
        return (
          <AuditTrail
            walletAddress={walletAddress}
            isConnected={isConnected}
            activities={activities}
            addActivity={addActivity}
            clearActivities={clearActivities}
          />
        );

      case "security":
        return <SecurityMonitoring walletAddress={walletAddress} isConnected={isConnected} />;

      case "transaction":
        return <TransactionVerification setCurrentPage={setCurrentPage} />;

      case "explorer":
        return <BlockchainExplorer setCurrentPage={setCurrentPage} />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        setCurrentPage={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
}

export default App;