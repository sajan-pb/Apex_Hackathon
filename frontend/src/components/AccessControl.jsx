import { useState, useEffect } from "react";
import { getSigner } from "../blockchain/provider.js";
import { getContract } from "../blockchain/contracts.js";

const ZERO_BYTES32 = "0x" + "0".repeat(64);

function AccessControl({ walletAddress, isConnected, addActivity }) {
  // ===== ORIGINAL LOCAL DEMO STATE =====
  const [users, setUsers] = useState([]);
  const [newWallet, setNewWallet] = useState("");
  const [selectedRole, setSelectedRole] = useState("User");
  const [message, setMessage] = useState("");

  const roles = [
    { name: "Admin", icon: "👑", description: "Full platform access and user management." },
    { name: "Manager", icon: "🛡️", description: "Manage assets and monitor platform activity." },
    { name: "User", icon: "👤", description: "Basic access to identity and digital assets." },
    { name: "Auditor", icon: "🔍", description: "View blockchain activity and audit records." },
  ];

  // ===== REAL ON-CHAIN GOVERNANCE STATE =====
  const [admins, setAdmins] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [govLoading, setGovLoading] = useState(false);
  const [govMessage, setGovMessage] = useState("");

  const [proposeTarget, setProposeTarget] = useState("IdentityRegistry");
  const [proposeAction, setProposeAction] = useState("GRANT_ROLE");
  const [proposeRoleName, setProposeRoleName] = useState("MANAGER");
  const [proposeAccount, setProposeAccount] = useState("");

  const ACTION_LABELS = ["Grant Role", "Revoke Role", "Revoke Identity"];
  const ACTION_VALUES = { GRANT_ROLE: 0, REVOKE_ROLE: 1, REVOKE_IDENTITY: 2 };

  const shortenAddress = (address) => {
    if (!address) return "";
    if (address.length < 15) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const loadGovernanceState = async () => {
    if (!isConnected) return;
    setGovLoading(true);
    setGovMessage("");
    try {
      const signer = await getSigner();
      const multisig = getContract("MultiSigAdmin", signer);

      const adminAddresses = await Promise.all([
        multisig.admins(0),
        multisig.admins(1),
        multisig.admins(2),
      ]);
      setAdmins(adminAddresses);

      const currentAddr = await signer.getAddress();
      setIsCurrentUserAdmin(await multisig.isAdmin(currentAddr));

      const count = Number(await multisig.proposalCount());
      const loaded = [];
      for (let i = 0; i < count; i++) {
        const p = await multisig.proposals(i);
        loaded.push({
          id: i,
          actionType: Number(p[0]),
          target: p[1],
          role: p[2],
          account: p[3],
          confirmations: Number(p[4]),
          executed: p[5],
        });
      }
      setProposals(loaded.reverse());
    } catch (error) {
      console.error(error);
      setGovMessage("❌ Could not load governance data: " + (error.reason || error.message));
    } finally {
      setGovLoading(false);
    }
  };

  useEffect(() => {
    loadGovernanceState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, walletAddress]);

  const submitProposal = async (e) => {
    e.preventDefault();
    setGovMessage("");

    if (!isConnected) {
      setGovMessage("❌ Connect your wallet first.");
      return;
    }
    const walletPattern = /^0x[a-fA-F0-9]{40}$/;
    if (!walletPattern.test(proposeAccount.trim())) {
      setGovMessage("❌ Enter a valid wallet address for the account field.");
      return;
    }

    try {
      setGovLoading(true);
      const signer = await getSigner();
      const multisig = getContract("MultiSigAdmin", signer);
      const targetContract = getContract(proposeTarget, signer);

      let roleHash = ZERO_BYTES32;
      if (ACTION_VALUES[proposeAction] !== ACTION_VALUES.REVOKE_IDENTITY) {
        if (proposeRoleName === "ADMIN") {
          roleHash = await targetContract.DEFAULT_ADMIN_ROLE();
        } else if (proposeRoleName === "MANAGER") {
          roleHash = await targetContract.MANAGER_ROLE();
        } else if (proposeRoleName === "AUDITOR") {
          roleHash = await targetContract.AUDITOR_ROLE();
        }
      }

      const tx = await multisig.propose(
        ACTION_VALUES[proposeAction],
        await targetContract.getAddress(),
        roleHash,
        proposeAccount.trim()
      );
      await tx.wait();

      setGovMessage("✅ Proposal submitted and auto-confirmed by you (1 of 2 needed).");
      if (addActivity) {
        addActivity("Governance", `Proposed ${ACTION_LABELS[ACTION_VALUES[proposeAction]]} for ${proposeAccount.trim()}`);
      }
      setProposeAccount("");
      await loadGovernanceState();
    } catch (error) {
      console.error(error);
      setGovMessage("❌ " + (error.reason || error.message));
    } finally {
      setGovLoading(false);
    }
  };

  const confirmProposal = async (proposalId) => {
    setGovMessage("");
    try {
      setGovLoading(true);
      const signer = await getSigner();
      const multisig = getContract("MultiSigAdmin", signer);
      const tx = await multisig.confirm(proposalId);
      await tx.wait();

      setGovMessage(`✅ Confirmed proposal #${proposalId}.`);
      if (addActivity) {
        addActivity("Governance", `Confirmed proposal #${proposalId}`);
      }
      await loadGovernanceState();
    } catch (error) {
      console.error(error);
      setGovMessage("❌ " + (error.reason || error.message));
    } finally {
      setGovLoading(false);
    }
  };

  // ===== ORIGINAL LOCAL DEMO HANDLERS =====
  const addUser = (e) => {
    e.preventDefault();
    if (!isConnected) { setMessage("❌ Please connect your wallet first."); return; }
    if (!newWallet.trim()) { setMessage("❌ Please enter a wallet address."); return; }
    const walletPattern = /^0x[a-fA-F0-9]{40}$/;
    if (!walletPattern.test(newWallet.trim())) { setMessage("❌ Please enter a valid Ethereum wallet address."); return; }
    const walletExists = users.some((user) => user.wallet.toLowerCase() === newWallet.trim().toLowerCase());
    if (walletExists) { setMessage("⚠️ This wallet already has a role."); return; }
    const newUser = { id: Date.now(), wallet: newWallet.trim(), role: selectedRole, addedAt: new Date().toLocaleString() };
    setUsers([...users, newUser]);
    if (addActivity) addActivity("Access", `${newUser.role} role assigned to wallet ${newUser.wallet}`);
    setNewWallet("");
    setSelectedRole("User");
    setMessage(`✅ ${newUser.role} role assigned successfully.`);
  };

  const removeUser = (id) => {
    const user = users.find((item) => item.id === id);
    setUsers(users.filter((user) => user.id !== id));
    if (user && addActivity) addActivity("Access", `Access removed from wallet ${user.wallet}`);
    setMessage("🗑️ User access removed successfully.");
  };

  const updateRole = (id, role) => {
    const user = users.find((item) => item.id === id);
    setUsers(users.map((user) => (user.id === id ? { ...user, role } : user)));
    if (user && addActivity) addActivity("Access", `Role updated to ${role} for wallet ${user.wallet}`);
    setMessage("✅ User role updated successfully.");
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
      <div className="section-title" style={{ marginBottom: "2rem" }}>
        <h2>Access Control</h2>
        <p>Manage user roles, permissions and blockchain access rights.</p>
      </div>

      {isConnected ? (
        <div className="wallet-status" style={{ marginBottom: "2rem" }}>
          <strong>🟢 Wallet Connected</strong>
          <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{walletAddress}</p>
        </div>
      ) : (
        <div className="wallet-status" style={{ marginBottom: "2rem", background: "rgba(239,68,68,0.1)", borderColor: "#ef4444" }}>
          <strong style={{ color: "#fca5a5" }}>⚠️ Wallet Not Connected</strong>
          <p style={{ marginTop: "0.5rem", color: "#fca5a5" }}>Connect your MetaMask wallet to use governance.</p>
        </div>
      )}

      <div className="service-card" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
        <div className="card-icon">⛓️</div>
        <h3>On-Chain Governance — 2-of-3 Multisig</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Real, live calls to your deployed MultiSigAdmin contract. No single wallet — including yours,
          even as an admin — can grant a role or revoke an identity alone. Two of the three designated
          admins must confirm.
        </p>

        {admins.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <strong>Designated admins:</strong>
            <ul style={{ marginTop: "0.5rem" }}>
              {admins.map((a, i) => (
                <li key={i} style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                  {shortenAddress(a)} {walletAddress?.toLowerCase() === a?.toLowerCase() && "(you)"}
                </li>
              ))}
            </ul>
            {isConnected && (
              <p style={{ marginTop: "0.5rem" }}>
                {isCurrentUserAdmin
                  ? "✅ Your wallet is a designated admin."
                  : "You are not one of the three designated admins — you can view proposals but not propose or confirm."}
              </p>
            )}
          </div>
        )}

        {govMessage && (
          <div className="wallet-status" style={{ marginBottom: "1.5rem" }}>
            <p>{govMessage}</p>
          </div>
        )}

        {isConnected && isCurrentUserAdmin && (
          <form onSubmit={submitProposal} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            <select value={proposeAction} onChange={(e) => setProposeAction(e.target.value)} style={inputStyle}>
              <option value="GRANT_ROLE">Grant Role</option>
              <option value="REVOKE_ROLE">Revoke Role</option>
              <option value="REVOKE_IDENTITY">Revoke Identity</option>
            </select>

            <select value={proposeTarget} onChange={(e) => setProposeTarget(e.target.value)} style={inputStyle}>
              <option value="IdentityRegistry">IdentityRegistry</option>
              <option value="AssetNFT">AssetNFT</option>
            </select>

            {proposeAction !== "REVOKE_IDENTITY" && (
              <select value={proposeRoleName} onChange={(e) => setProposeRoleName(e.target.value)} style={inputStyle}>
                <option value="MANAGER">Manager</option>
                <option value="AUDITOR">Auditor</option>
                <option value="ADMIN">Admin</option>
              </select>
            )}

            <input
              type="text"
              placeholder="Account address (0x...)"
              value={proposeAccount}
              onChange={(e) => setProposeAccount(e.target.value)}
              style={inputStyle}
            />

            <button type="submit" className="hero-button" disabled={govLoading}>
              {govLoading ? "Submitting..." : "Propose Action →"}
            </button>
          </form>
        )}

        <h4 style={{ marginBottom: "1rem" }}>Proposals</h4>
        {proposals.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No proposals yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {proposals.map((p) => (
              <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1.5rem" }}>
                <strong>#{p.id} — {ACTION_LABELS[p.actionType]}</strong>
                <p style={{ fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all", margin: "0.5rem 0" }}>
                  account: {p.account}
                </p>
                <p>Confirmations: {p.confirmations} / 2 {p.executed ? "— ✅ Executed" : "— ⏳ Pending"}</p>
                {isCurrentUserAdmin && !p.executed && (
                  <button className="card-btn" onClick={() => confirmProposal(p.id)} disabled={govLoading}>
                    Confirm
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="wallet-status" style={{ marginBottom: "1.5rem", background: "rgba(255,255,255,0.03)" }}>
        <strong>📋 Local Role Preview (not connected to the blockchain)</strong>
        <p style={{ marginTop: "0.5rem", color: "var(--text-muted)" }}>
          The section below is a local, illustrative preview only — it doesn't call the smart contract
          and resets on page refresh. Use the On-Chain Governance section above for anything real.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {roles.map((role) => (
          <div key={role.name} className="service-card" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{role.icon}</div>
            <h3>{role.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{role.description}</p>
          </div>
        ))}
      </div>

      <div className="service-card" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
        <div className="card-icon">➕</div>
        <h3>Assign User Role (local preview)</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Assign a role locally — not on-chain.</p>
        {!isConnected ? (
          <p style={{ color: "#fca5a5" }}>⚠️ Connect your wallet before assigning access roles.</p>
        ) : (
          <form onSubmit={addUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input type="text" placeholder="Enter wallet address" value={newWallet} onChange={(e) => setNewWallet(e.target.value)} style={inputStyle} />
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={inputStyle}>
              {roles.map((role) => (<option key={role.name} value={role.name}>{role.icon} {role.name}</option>))}
            </select>
            <button type="submit" className="hero-button" style={{ width: "100%", marginTop: "1rem" }}>Assign Role →</button>
          </form>
        )}
      </div>

      {users.length > 0 && (
        <div className="service-card" style={{ padding: "2.5rem" }}>
          <h3>Local Preview Registry</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {users.map((user) => (
              <div key={user.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1.5rem" }}>
                <p style={{ fontFamily: "monospace" }}>{shortenAddress(user.wallet)} — {user.role}</p>
                <button className="card-btn" onClick={() => removeUser(user.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessControl;