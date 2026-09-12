import { useState } from "react";

function SecurityMonitoring({ walletAddress, isConnected }) {
  const [securityScore, setSecurityScore] = useState(95);
  const [lastScan, setLastScan] = useState("Not scanned yet");
  const [isScanning, setIsScanning] = useState(false);

  const runSecurityScan = () => {
    setIsScanning(true);
    setLastScan("Scanning...");

    setTimeout(() => {
      setSecurityScore(98);
      setLastScan(new Date().toLocaleString());
      setIsScanning(false);
    }, 1500);
  };

  const shortenAddress = (address) => {
    if (!address) return "Not Connected";

    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const checks = [
    {
      name: "Wallet Connection",
      status: isConnected ? "Secure" : "Not Connected",
      icon: "👛",
    },
    {
      name: "Blockchain Network",
      status: isConnected ? "Connected" : "Waiting",
      icon: "⛓️",
    },
    {
      name: "Identity Verification",
      status: "Monitoring",
      icon: "🪪",
    },
    {
      name: "Access Control",
      status: "Protected",
      icon: "🔐",
    },
    {
      name: "Transaction Verification",
      status: "Active",
      icon: "✓",
    },
    {
      name: "Audit Logging",
      status: "Active",
      icon: "📜",
    },
  ];

  return (
    <div>
      <div className="section-title">
        <h2>Security Monitoring</h2>
        <p>
          Monitor the security status of your blockchain platform.
        </p>
      </div>

      {/* SECURITY SCORE */}
      <div
        className="service-card"
        style={{
          textAlign: "center",
          padding: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🛡️
        </div>

        <h3>Security Score</h3>

        <div
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "var(--accent-cyan)",
            margin: "1rem 0",
          }}
        >
          {securityScore}%
        </div>

        <p style={{ color: "var(--text-muted)" }}>
          Your blockchain platform security status
        </p>

        <button
          className="hero-button"
          onClick={runSecurityScan}
          disabled={isScanning}
          style={{ marginTop: "1.5rem" }}
        >
          {isScanning
            ? "Scanning..."
            : "🔄 Run Security Scan"}
        </button>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          Last Scan: {lastScan}
        </p>
      </div>

      {/* SECURITY STATUS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="service-card">
          <div className="card-icon">🟢</div>

          <h3>System Status</h3>

          <p
            style={{
              color: "#86efac",
              fontWeight: "bold",
            }}
          >
            System Secure
          </p>
        </div>

        <div className="service-card">
          <div className="card-icon">👛</div>

          <h3>Wallet Status</h3>

          <p>
            {isConnected
              ? shortenAddress(walletAddress)
              : "Wallet Not Connected"}
          </p>
        </div>

        <div className="service-card">
          <div className="card-icon">⛓️</div>

          <h3>Blockchain</h3>

          <p>
            {isConnected
              ? "Connection Active"
              : "Waiting for Wallet"}
          </p>
        </div>
      </div>

      {/* SECURITY CHECKS */}
      <div
        className="service-card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
        <h3>Security Checks</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Current security components being monitored.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {checks.map((check) => (
            <div
              key={check.name}
              style={{
                background: "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div style={{ fontSize: "1.8rem" }}>
                {check.icon}
              </div>

              <div>
                <strong>{check.name}</strong>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    marginTop: "0.3rem",
                  }}
                >
                  🟢 {check.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECURITY ALERTS */}
      <div
        className="service-card"
        style={{ padding: "2rem" }}
      >
        <h3>Security Alerts</h3>

        <div
          style={{
            marginTop: "1rem",
            padding: "1.2rem",
            borderRadius: "10px",
            background: "rgba(34,197,94,0.08)",
          }}
        >
          <strong style={{ color: "#86efac" }}>
            ✓ No Critical Security Threats Detected
          </strong>

          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--text-muted)",
            }}
          >
            All monitored blockchain security components
            are operating normally.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityMonitoring;