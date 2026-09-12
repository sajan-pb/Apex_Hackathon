import { useState } from "react";

function DigitalAssets({
  walletAddress,
  isConnected,
  addActivity,
}) {
  const [assetName, setAssetName] = useState("");
  const [assetDescription, setAssetDescription] =
    useState("");

  const [assetType, setAssetType] =
    useState("Document");

  const [assets, setAssets] = useState([]);
  const [message, setMessage] = useState("");

  const createAsset = (e) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage(
        "❌ Please connect your MetaMask wallet first."
      );
      return;
    }

    if (
      !assetName.trim() ||
      !assetDescription.trim()
    ) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    const newAsset = {
      id: `ASSET-${Date.now()
        .toString()
        .slice(-8)}`,
      name: assetName.trim(),
      description: assetDescription.trim(),
      type: assetType,
      owner: walletAddress,
      status: "Active",
      createdAt: new Date().toLocaleString(),
    };

    setAssets((previousAssets) => [
      ...previousAssets,
      newAsset,
    ]);

    if (addActivity) {
      addActivity(
        "Asset",
        `Created digital asset: ${newAsset.name}`
      );
    }

    setMessage(
      `✅ Digital Asset "${newAsset.name}" created successfully!`
    );

    setAssetName("");
    setAssetDescription("");
    setAssetType("Document");
  };

  const deleteAsset = (assetId, assetName) => {
    setAssets((previousAssets) =>
      previousAssets.filter(
        (asset) => asset.id !== assetId
      )
    );

    if (addActivity) {
      addActivity(
        "Asset",
        `Removed digital asset: ${assetName}`
      );
    }

    setMessage(
      `🗑️ Digital Asset "${assetName}" removed successfully.`
    );
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
        <h2>Digital Asset Vault</h2>

        <p>
          Create, manage and securely track
          blockchain-based digital assets.
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
            background: "rgba(239,68,68,0.1)",
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
            Connect MetaMask before creating
            blockchain assets.
          </p>
        </div>
      )}

      {message && (
        <div
          className="wallet-status"
          style={{ marginBottom: "2rem" }}
        >
          <p>{message}</p>

          <button
            onClick={() => setMessage("")}
            style={{
              marginTop: "0.8rem",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* CREATE ASSET */}
      <div
        className="service-card"
        style={{
          padding: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card-icon">💎</div>

        <h3>Create Digital Asset</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Create a new digital asset linked to your
          connected wallet.
        </p>

        {!isConnected ? (
          <p style={{ color: "#fca5a5" }}>
            ⚠️ Connect your wallet to continue.
          </p>
        ) : (
          <form
            onSubmit={createAsset}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Asset Name"
              value={assetName}
              onChange={(e) =>
                setAssetName(e.target.value)
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Asset Description"
              value={assetDescription}
              onChange={(e) =>
                setAssetDescription(e.target.value)
              }
              style={{
                ...inputStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
            />

            <select
              value={assetType}
              onChange={(e) =>
                setAssetType(e.target.value)
              }
              style={inputStyle}
            >
              <option value="Document">
                📄 Document
              </option>

              <option value="Certificate">
                📜 Certificate
              </option>

              <option value="Image">
                🖼️ Image
              </option>

              <option value="Token">
                🪙 Token
              </option>

              <option value="Other">
                📦 Other
              </option>
            </select>

            <button
              type="submit"
              className="hero-button"
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
            >
              Create Asset →
            </button>
          </form>
        )}
      </div>

      {/* STATISTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>{assets.length}</h3>
          <p>Total Assets</p>
        </div>

        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>
            {
              assets.filter(
                (asset) =>
                  asset.status === "Active"
              ).length
            }
          </h3>

          <p>Active Assets</p>
        </div>

        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>🟢</h3>
          <p>Vault Active</p>
        </div>
      </div>

      {/* ASSET LIST */}
      <div
        className="service-card"
        style={{ padding: "2.5rem" }}
      >
        <div className="card-icon">📦</div>

        <h3>Your Digital Assets</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Assets created during this session.
        </p>

        {assets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "2rem" }}>📭</p>
            <p>No digital assets created yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {assets.map((asset) => (
              <div
                key={asset.id}
                style={{
                  background:
                    "rgba(255,255,255,0.03)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    color: "var(--accent-cyan)",
                    fontWeight: "bold",
                  }}
                >
                  {asset.id}
                </p>

                <h3>{asset.name}</h3>

                <p
                  style={{
                    color: "var(--text-muted)",
                    marginTop: "0.8rem",
                  }}
                >
                  {asset.description}
                </p>

                <p style={{ marginTop: "1rem" }}>
                  <strong>Type:</strong>{" "}
                  {asset.type}
                </p>

                <p>
                  <strong>Status:</strong> 🟢{" "}
                  {asset.status}
                </p>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    wordBreak: "break-all",
                  }}
                >
                  <strong>Owner Wallet:</strong>
                  <br />
                  {asset.owner}
                </p>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Created:
                  <br />
                  {asset.createdAt}
                </p>

                <button
                  className="card-btn"
                  onClick={() =>
                    deleteAsset(
                      asset.id,
                      asset.name
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: "1.5rem",
                  }}
                >
                  🗑️ Remove Asset
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="wallet-status"
        style={{ marginTop: "2rem" }}
      >
        <strong>
          ⛓️ Blockchain Integration Status
        </strong>

        <p
          style={{
            marginTop: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Asset creation and removal actions are
          recorded in the shared Audit Trail.
          Smart contract integration can later connect
          this module to the AssetNFT contract.
        </p>
      </div>
    </div>
  );
}

export default DigitalAssets;