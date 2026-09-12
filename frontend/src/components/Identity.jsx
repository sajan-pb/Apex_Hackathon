import { useState } from "react";

function Identity({
  walletAddress,
  isConnected,
  addActivity,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identities, setIdentities] = useState([]);

  const [verifyId, setVerifyId] = useState("");
  const [verificationResult, setVerificationResult] =
    useState(null);

  const [message, setMessage] = useState("");

  const registerIdentity = (e) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage(
        "❌ Please connect your MetaMask wallet first."
      );
      return;
    }

    if (!name.trim() || !email.trim()) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    const newIdentityId = `ID-${Date.now()
      .toString()
      .slice(-8)}`;

    const newIdentity = {
      id: newIdentityId,
      name: name.trim(),
      email: email.trim(),
      wallet: walletAddress,
      status: "Active",
      createdAt: new Date().toLocaleString(),
    };

    setIdentities((previousIdentities) => [
      ...previousIdentities,
      newIdentity,
    ]);

    if (addActivity) {
      addActivity(
        "Identity",
        `New identity registered: ${newIdentity.name} (${newIdentityId})`
      );
    }

    setMessage(
      `✅ Identity registered successfully! Identity ID: ${newIdentityId}`
    );

    setName("");
    setEmail("");
    setVerificationResult(null);
  };

  const verifyIdentity = (e) => {
    e.preventDefault();

    if (!verifyId.trim()) {
      setVerificationResult({
        type: "error",
        message: "Please enter an Identity ID.",
      });

      return;
    }

    const foundIdentity = identities.find(
      (identity) =>
        identity.id.toLowerCase() ===
        verifyId.trim().toLowerCase()
    );

    if (foundIdentity) {
      setVerificationResult({
        type: "success",
        identity: foundIdentity,
      });

      if (addActivity) {
        addActivity(
          "Identity",
          `Identity verified successfully: ${foundIdentity.name} (${foundIdentity.id})`
        );
      }
    } else {
      setVerificationResult({
        type: "error",
        message:
          "Identity not found in the local registry.",
      });

      if (addActivity) {
        addActivity(
          "Identity",
          `Identity verification failed for ID: ${verifyId.trim()}`
        );
      }
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div>
      <div
        className="section-title"
        style={{ marginBottom: "2rem" }}
      >
        <h2>Identity Management</h2>

        <p>
          Register, verify and manage
          blockchain-based digital identities.
        </p>
      </div>

      {isConnected ? (
        <div
          className="wallet-status"
          style={{ marginBottom: "2rem" }}
        >
          <strong>🟢 Wallet Connected</strong>

          <p
            style={{
              marginTop: "0.5rem",
              wordBreak: "break-all",
            }}
          >
            {walletAddress}
          </p>
        </div>
      ) : (
        <div
          className="wallet-status"
          style={{
            marginBottom: "2rem",
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "#ef4444",
          }}
        >
          <strong style={{ color: "#fca5a5" }}>
            ⚠️ Wallet Not Connected
          </strong>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#fca5a5",
            }}
          >
            Connect your MetaMask wallet to manage
            digital identities.
          </p>
        </div>
      )}

      {message && (
        <div
          className="wallet-status"
          style={{
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          <p>{message}</p>

          <button
            onClick={() => setMessage("")}
            style={{
              position: "absolute",
              top: "8px",
              right: "10px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* REGISTER */}
        <div
          className="service-card"
          style={{ padding: "2.5rem" }}
        >
          <div className="card-icon">🪪</div>

          <h3>Register New Identity</h3>

          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Create a new digital identity linked to
            your wallet.
          </p>

          {!isConnected ? (
            <p style={{ color: "#fca5a5" }}>
              ⚠️ Please connect your MetaMask wallet
              first.
            </p>
          ) : (
            <form
              onSubmit={registerIdentity}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={inputStyle}
              />

              <button
                type="submit"
                className="hero-button"
                style={{
                  marginTop: "1rem",
                  width: "100%",
                }}
              >
                Register Identity →
              </button>
            </form>
          )}
        </div>

        {/* VERIFY */}
        <div
          className="service-card"
          style={{ padding: "2.5rem" }}
        >
          <div className="card-icon">🔍</div>

          <h3>Verify Identity</h3>

          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Enter an Identity ID to verify its
            registration status.
          </p>

          <form
            onSubmit={verifyIdentity}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Enter Identity ID"
              value={verifyId}
              onChange={(e) =>
                setVerifyId(e.target.value)
              }
              style={inputStyle}
            />

            <button
              type="submit"
              className="card-btn"
              style={{ width: "100%" }}
            >
              Verify Identity →
            </button>
          </form>

          {verificationResult && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "8px",
                background:
                  verificationResult.type ===
                  "success"
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                border:
                  verificationResult.type ===
                  "success"
                    ? "1px solid #22c55e"
                    : "1px solid #ef4444",
              }}
            >
              {verificationResult.type ===
              "success" ? (
                <>
                  <h4>✅ Identity Verified</h4>

                  <p>
                    <strong>Name:</strong>{" "}
                    {
                      verificationResult.identity
                        .name
                    }
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {
                      verificationResult.identity
                        .email
                    }
                  </p>

                  <p>
                    <strong>Status:</strong> 🟢 Active
                  </p>
                </>
              ) : (
                <p>
                  ❌ {verificationResult.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* IDENTITIES */}
      <div
        className="service-card"
        style={{
          padding: "2.5rem",
          marginTop: "2rem",
        }}
      >
        <div className="card-icon">📋</div>

        <h3>Registered Identities</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Identities registered during this session.
        </p>

        {identities.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No identities registered yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {identities.map((identity) => (
              <div
                key={identity.id}
                style={{
                  background:
                    "rgba(255,255,255,0.03)",
                  padding: "1.2rem",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p
                  style={{
                    color: "var(--accent-cyan)",
                    fontWeight: "bold",
                  }}
                >
                  {identity.id}
                </p>

                <p>
                  <strong>👤 Name:</strong>{" "}
                  {identity.name}
                </p>

                <p>
                  <strong>📧 Email:</strong>{" "}
                  {identity.email}
                </p>

                <p>
                  <strong>Status:</strong> 🟢{" "}
                  {identity.status}
                </p>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    wordBreak: "break-all",
                  }}
                >
                  Wallet:
                  <br />
                  {identity.wallet}
                </p>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Created:
                  <br />
                  {identity.createdAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="wallet-status"
        style={{ marginTop: "2rem" }}
      >
        <strong>⛓️ Blockchain Integration Status</strong>

        <p
          style={{
            marginTop: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Identity registration and verification
          events are connected to the platform Audit
          Trail. Smart contract integration can later
          connect this module to the
          IdentityRegistry contract.
        </p>
      </div>
    </div>
  );
}

export default Identity;