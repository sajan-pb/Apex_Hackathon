import { useEffect, useState } from "react";
import { getSigner, getProvider } from "../blockchain/provider.js";
import { getContract } from "../blockchain/contracts.js";

const ZERO_BYTES32 = "0x" + "0".repeat(64);
const ACTION_VALUES = { GRANT_ROLE: 0, REVOKE_ROLE: 1, REVOKE_IDENTITY: 2 };
const ACTION_LABELS = ["Grant Role", "Revoke Role", "Revoke Identity"];

function AccessControl({ walletAddress, isConnected }) {
  const [admins, setAdmins] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleStatus, setRoleStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("GRANT_ROLE");
  const [target, setTarget] = useState("IdentityRegistry");
  const [roleName, setRoleName] = useState("MANAGER");
  const [account, setAccount] = useState("");

  const shorten = (a) => a ? `${a.slice(0, 8)}...${a.slice(-6)}` : "";

  const load = async () => {
    if (!isConnected) return;
    try {
      const provider = getProvider();
      const multisig = getContract("MultiSigAdmin", provider);
      const current = walletAddress || (await (await getSigner()).getAddress());
      const [a0, a1, a2] = await Promise.all([multisig.admins(0), multisig.admins(1), multisig.admins(2)]);
      setAdmins([a0, a1, a2]);
      setIsAdmin(await multisig.isAdmin(current));

      const identity = getContract("IdentityRegistry", provider);
      const asset = getContract("AssetNFT", provider);
      const managerIdentity = await identity.MANAGER_ROLE();
      const auditorIdentity = await identity.AUDITOR_ROLE();
      const adminIdentity = await identity.DEFAULT_ADMIN_ROLE();
      const managerAsset = await asset.MANAGER_ROLE();
      const auditorAsset = await asset.AUDITOR_ROLE();
      const adminAsset = await asset.DEFAULT_ADMIN_ROLE();
      setRoleStatus({
        identity: {
          manager: await identity.hasRole(managerIdentity, current),
          auditor: await identity.hasRole(auditorIdentity, current),
          admin: await identity.hasRole(adminIdentity, current),
        },
        asset: {
          manager: await asset.hasRole(managerAsset, current),
          auditor: await asset.hasRole(auditorAsset, current),
          admin: await asset.hasRole(adminAsset, current),
        },
      });

      const count = Number(await multisig.proposalCount());
      const loaded = [];
      for (let i = 0; i < count; i++) {
        const p = await multisig.proposals(i);
        loaded.push({ id: i, actionType: Number(p[0]), target: p[1], role: p[2], account: p[3], confirmations: Number(p[4]), executed: p[5] });
      }
      setProposals(loaded.reverse());
    } catch (error) {
      console.error(error);
      setMessage(`Error loading on-chain access data: ${error.reason || error.shortMessage || error.message}`);
    }
  };

  useEffect(() => { load(); }, [isConnected, walletAddress]);

  const submitProposal = async (e) => {
    e.preventDefault();
    try {
      if (!isConnected) throw new Error("Connect MetaMask first.");
      if (!/^0x[a-fA-F0-9]{40}$/.test(account.trim())) throw new Error("Enter a valid target wallet address.");
      if (action === "REVOKE_IDENTITY") {
        if (target !== "IdentityRegistry") throw new Error("Identity revocation must target IdentityRegistry.");
      }
      setLoading(true); setMessage("");
      const signer = await getSigner();
      const multisig = getContract("MultiSigAdmin", signer);
      const targetContract = getContract(target, signer);
      let roleHash = ZERO_BYTES32;
      if (action !== "REVOKE_IDENTITY") {
        roleHash = roleName === "ADMIN" ? await targetContract.DEFAULT_ADMIN_ROLE() : roleName === "MANAGER" ? await targetContract.MANAGER_ROLE() : await targetContract.AUDITOR_ROLE();
      }
      const tx = await multisig.propose(ACTION_VALUES[action], await targetContract.getAddress(), roleHash, account.trim());
      await tx.wait();
      setMessage("Proposal created and auto-confirmed by the proposer. A second designated admin must confirm it.");
      setAccount("");
      await load();
    } catch (error) {
      console.error(error); setMessage(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally { setLoading(false); }
  };

  const confirmProposal = async (id) => {
    try {
      setLoading(true); setMessage("");
      const tx = await getContract("MultiSigAdmin", await getSigner()).confirm(id);
      await tx.wait();
      setMessage(`Proposal #${id} confirmed. The blockchain now has the updated governance state.`);
      await load();
    } catch (error) {
      console.error(error); setMessage(`Error: ${error.reason || error.shortMessage || error.message}`);
    } finally { setLoading(false); }
  };

  return (
    <section className="dashboard">
      <div className="section-title">
        <h2>Role-Based Access Control</h2>
        <p>Permissions are read from and enforced by the deployed smart contracts.</p>
      </div>

      <div className="wallet-status" style={{ marginBottom: "1.5rem" }}>
        <strong>Current Wallet</strong>
        <p style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>{isConnected ? walletAddress : "Not connected"}</p>
        {isConnected && <p style={{ marginTop: "0.5rem" }}>{isAdmin ? "✓ Designated multisig admin" : "Not a designated multisig admin"}</p>}
      </div>

      {roleStatus && (
        <div className="service-card" style={{ marginBottom: "1.5rem" }}>
          <h3>Your On-Chain Privileges</h3>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 1rem" }}>These values are read directly from AccessControl.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={{ textAlign: "left", padding: "0.7rem" }}>Contract</th><th>Admin</th><th>Manager</th><th>Auditor</th></tr></thead>
              <tbody>
                <tr><td style={{ padding: "0.7rem" }}>IdentityRegistry</td><td style={{ textAlign: "center" }}>{roleStatus.identity.admin ? "✓" : "—"}</td><td style={{ textAlign: "center" }}>{roleStatus.identity.manager ? "✓" : "—"}</td><td style={{ textAlign: "center" }}>{roleStatus.identity.auditor ? "✓" : "—"}</td></tr>
                <tr><td style={{ padding: "0.7rem" }}>AssetNFT</td><td style={{ textAlign: "center" }}>{roleStatus.asset.admin ? "✓" : "—"}</td><td style={{ textAlign: "center" }}>{roleStatus.asset.manager ? "✓" : "—"}</td><td style={{ textAlign: "center" }}>{roleStatus.asset.auditor ? "✓" : "—"}</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}><strong>Manager:</strong> issue/revoke identities on IdentityRegistry and mint assets on AssetNFT when the corresponding Manager role is granted.</p>
        </div>
      )}

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-icon">🔐</div>
        <h3>2-of-3 Multisig Governance</h3>
        <p>Role changes and identity revocations require two of the three designated admin wallets.</p>
        <div style={{ margin: "1rem 0" }}><strong>Designated admins</strong>{admins.map((a, i) => <p key={a} style={{ fontFamily: "monospace", marginTop: "0.4rem" }}>Admin {i + 1}: {shorten(a)}</p>)}</div>

        {isAdmin && (
          <form onSubmit={submitProposal} style={{ display: "grid", gap: "0.8rem" }}>
            <select value={action} onChange={(e) => setAction(e.target.value)} className="transaction-input">
              <option value="GRANT_ROLE">Grant Role</option>
              <option value="REVOKE_ROLE">Revoke Role</option>
              <option value="REVOKE_IDENTITY">Revoke Identity</option>
            </select>
            {action === "REVOKE_IDENTITY" ? (
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="transaction-input"><option value="IdentityRegistry">IdentityRegistry</option></select>
            ) : (
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="transaction-input"><option value="IdentityRegistry">IdentityRegistry</option><option value="AssetNFT">AssetNFT</option></select>
            )}
            {action !== "REVOKE_IDENTITY" && <select value={roleName} onChange={(e) => setRoleName(e.target.value)} className="transaction-input"><option value="MANAGER">Manager</option><option value="AUDITOR">Auditor</option><option value="ADMIN">Admin</option></select>}
            <input className="transaction-input" placeholder="Wallet address" value={account} onChange={(e) => setAccount(e.target.value)} />
            <button className="hero-button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Proposal"}</button>
          </form>
        )}
        {!isAdmin && isConnected && <p style={{ color: "var(--text-muted)" }}>This wallet can observe governance but cannot propose or confirm.</p>}
      </div>

      <div className="service-card">
        <h3>Governance Proposals</h3>
        {proposals.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No proposals recorded on-chain.</p> : proposals.map((p) => (
          <div key={p.id} style={{ marginTop: "1rem", padding: "1rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}>
            <strong>#{p.id} — {ACTION_LABELS[p.actionType]}</strong>
            <p style={{ marginTop: "0.4rem", wordBreak: "break-all" }}>Target: {shorten(p.target)}</p>
            <p style={{ marginTop: "0.4rem", wordBreak: "break-all" }}>Account: {p.account}</p>
            <p style={{ marginTop: "0.4rem" }}>Confirmations: {p.confirmations} / 2 {p.executed ? "✓ Executed" : "— Pending"}</p>
            {isAdmin && !p.executed && <button className="card-btn" style={{ marginTop: "0.6rem" }} onClick={() => confirmProposal(p.id)} disabled={loading}>Confirm</button>}
          </div>
        ))}
        {message && <div className="wallet-status" style={{ marginTop: "1rem" }}><p>{message}</p></div>}
      </div>
    </section>
  );
}

export default AccessControl;
