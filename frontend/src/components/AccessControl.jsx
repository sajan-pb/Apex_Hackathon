import { useState } from "react";

function AccessControl({
  walletAddress,
  isConnected,
  addActivity,
}) {
  const [users, setUsers] = useState([]);
  const [newWallet, setNewWallet] = useState("");

  const [selectedRole, setSelectedRole] =
    useState("User");

  const [message, setMessage] = useState("");

  const roles = [
    {
      name: "Admin",
      icon: "👑",
      description:
        "Full platform access and user management.",
    },
    {
      name: "Manager",
      icon: "🛡️",
      description:
        "Manage assets and monitor platform activity.",
    },
    {
      name: "User",
      icon: "👤",
      description:
        "Basic access to identity and digital assets.",
    },
    {
      name: "Auditor",
      icon: "🔍",
      description:
        "View blockchain activity and audit records.",
    },
  ];

  const addUser = (e) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage(
        "❌ Please connect your wallet first."
      );
      return;
    }

    if (!newWallet.trim()) {
      setMessage(
        "❌ Please enter a wallet address."
      );
      return;
    }

    const walletPattern =
      /^0x[a-fA-F0-9]{40}$/;

    if (!walletPattern.test(newWallet.trim())) {
      setMessage(
        "❌ Please enter a valid Ethereum wallet address."
      );
      return;
    }

    const walletExists = users.some(
      (user) =>
        user.wallet.toLowerCase() ===
        newWallet.trim().toLowerCase()
    );

    if (walletExists) {
      setMessage(
        "⚠️ This wallet already has a role."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      wallet: newWallet.trim(),
      role: selectedRole,
      addedAt: new Date().toLocaleString(),
    };

    setUsers([...users, newUser]);

    if (addActivity) {
      addActivity(
        "Access",
        `${newUser.role} role assigned to wallet ${newUser.wallet}`
      );
    }

    setNewWallet("");
    setSelectedRole("User");

    setMessage(
      `✅ ${newUser.role} role assigned successfully.`
    );
  };

  const removeUser = (id) => {
    const user = users.find(
      (item) => item.id === id
    );

    setUsers(
      users.filter((user) => user.id !== id)
    );

    if (user && addActivity) {
      addActivity(
        "Access",
        `Access removed from wallet ${user.wallet}`
      );
    }

    setMessage(
      "🗑️ User access removed successfully."
    );
  };

  const updateRole = (id, role) => {
    const user = users.find(
      (item) => item.id === id
    );

    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, role }
          : user
      )
    );

    if (user && addActivity) {
      addActivity(
        "Access",
        `Role updated to ${role} for wallet ${user.wallet}`
      );
    }

    setMessage(
      "✅ User role updated successfully."
    );
  };

  const shortenAddress = (address) => {
    if (!address) return "";

    if (address.length < 15) {
      return address;
    }

    return `${address.slice(
      0,
      8
    )}...${address.slice(-6)}`;
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
        <h2>Access Control</h2>

        <p>
          Manage user roles, permissions and
          blockchain access rights.
        </p>
      </div>

      {isConnected ? (
        <div
          className="wallet-status"
          style={{ marginBottom: "2rem" }}
        >
          <strong>
            🟢 Administrator Wallet Connected
          </strong>

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
            Connect your MetaMask wallet to manage
            access permissions.
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

      {/* ROLE OVERVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {roles.map((role) => (
          <div
            key={role.name}
            className="service-card"
            style={{ padding: "1.5rem" }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "0.8rem",
              }}
            >
              {role.icon}
            </div>

            <h3>{role.name}</h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {role.description}
            </p>
          </div>
        ))}
      </div>

      {/* ASSIGN USER */}
      <div
        className="service-card"
        style={{
          padding: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card-icon">➕</div>

        <h3>Assign User Role</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Assign a blockchain access role to a wallet
          address.
        </p>

        {!isConnected ? (
          <p style={{ color: "#fca5a5" }}>
            ⚠️ Connect your wallet before assigning
            access roles.
          </p>
        ) : (
          <form
            onSubmit={addUser}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Enter wallet address"
              value={newWallet}
              onChange={(e) =>
                setNewWallet(e.target.value)
              }
              style={inputStyle}
            />

            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(e.target.value)
              }
              style={inputStyle}
            >
              {roles.map((role) => (
                <option
                  key={role.name}
                  value={role.name}
                >
                  {role.icon} {role.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="hero-button"
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
            >
              Assign Role →
            </button>
          </form>
        )}
      </div>

      {/* STATISTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>

        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>
            {
              users.filter(
                (user) =>
                  user.role === "Admin"
              ).length
            }
          </h3>

          <p>Administrators</p>
        </div>

        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>
            {
              users.filter(
                (user) =>
                  user.role === "User"
              ).length
            }
          </h3>

          <p>Standard Users</p>
        </div>

        <div
          className="service-card"
          style={{ padding: "1.5rem" }}
        >
          <h3>🟢</h3>
          <p>Access System Active</p>
        </div>
      </div>

      {/* USER REGISTRY */}
      <div
        className="service-card"
        style={{ padding: "2.5rem" }}
      >
        <div className="card-icon">🔐</div>

        <h3>User Access Registry</h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Manage wallet addresses and their assigned
          roles.
        </p>

        {users.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "2rem" }}>
              👥
            </p>

            <p>
              No users have been assigned roles yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background:
                    "rgba(255,255,255,0.03)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3>
                      {shortenAddress(user.wallet)}
                    </h3>

                    <p
                      style={{
                        color:
                          "var(--text-muted)",
                        fontSize: "0.8rem",
                        wordBreak: "break-all",
                      }}
                    >
                      {user.wallet}
                    </p>

                    <p
                      style={{
                        color:
                          "var(--text-muted)",
                        fontSize: "0.8rem",
                      }}
                    >
                      Added: {user.addedAt}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.8rem",
                      minWidth: "160px",
                    }}
                  >
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(
                          user.id,
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    >
                      {roles.map((role) => (
                        <option
                          key={role.name}
                          value={role.name}
                        >
                          {role.icon} {role.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="card-btn"
                      onClick={() =>
                        removeUser(user.id)
                      }
                    >
                      Remove Access
                    </button>
                  </div>
                </div>
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
          ⛓️ Blockchain Access Control
        </strong>

        <p
          style={{
            marginTop: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Role assignment, updates and access removal
          are recorded in the platform Audit Trail.
          Smart contract integration can later enforce
          these permissions on the blockchain.
        </p>
      </div>
    </div>
  );
}

export default AccessControl;