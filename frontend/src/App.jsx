import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="app">
      {/* Background Glows */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🔐</span>
          <span className="logo-text">Apex Secure Platform</span>
        </div>

        <button className="wallet-button" onClick={connectWallet}>
          <span className="status-indicator"></span>
          {isConnected ? shortenAddress(walletAddress) : "Connect Wallet"}
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-badge">
            BLOCKCHAIN SECURITY
          </div>

          <h1>
            Secure Identity.
            <br />
            Secure Assets.
            <br />
            <span className="gradient-text">Secure Access.</span>
          </h1>

          <p>
            A blockchain-based platform for identity verification,
            digital asset management and access control.
          </p>

          {!isConnected && (
            <button className="hero-button" onClick={connectWallet}>
              Connect MetaMask
              <span className="btn-arrow">→</span>
            </button>
          )}
        </section>

        <section className="dashboard">
          <div className="section-title">
            <h2>Platform Services</h2>
            <p>
              Manage your blockchain security services from one platform.
            </p>
          </div>

          <div className="card-grid">
            <div className="service-card">
              <div className="card-icon">🪪</div>
              <h3>Identity Management</h3>
              <p>
                Register, verify and manage blockchain-based user identities.
              </p>
              <button className="card-btn">Manage Identity →</button>
            </div>

            <div className="service-card">
              <div className="card-icon">💎</div>
              <h3>Digital Assets</h3>
              <p>
                Create, manage and securely track blockchain-based digital assets.
              </p>
              <button className="card-btn">View Assets →</button>
            </div>

            <div className="service-card">
              <div className="card-icon">🔐</div>
              <h3>Access Control</h3>
              <p>
                Manage user roles, permissions and blockchain access rights.
              </p>
              <button className="card-btn">Manage Access →</button>
            </div>

            <div className="service-card">
              <div className="card-icon">📜</div>
              <h3>Audit Trail</h3>
              <p>
                Monitor and verify important blockchain activities and transactions.
              </p>
              <button className="card-btn">View Audit Trail →</button>
            </div>
          </div>
        </section>

        {isConnected && (
          <section className="wallet-status fade-in-up">
            <div className="ws-header">
              <span className="status-dot"></span>
              <strong>Wallet Connected</strong>
            </div>
            <p className="ws-address">{walletAddress}</p>
          </section>
        )}
      </main>

      <footer>
        <p>
          © 2026 Apex Secure Platform | Blockchain Security System
        </p>
      </footer>
    </div>
  );
}

export default App;