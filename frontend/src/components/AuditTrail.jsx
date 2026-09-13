import { useEffect, useState } from "react";
import { getProvider } from "../blockchain/provider.js";
import { getContract } from "../blockchain/contracts.js";

const ACTIONS = ["Grant Role", "Revoke Role", "Revoke Identity"];

function AuditTrail({ isConnected }) {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const short = (a) => a ? `${a.slice(0, 8)}...${a.slice(-6)}` : "—";

  const loadEvents = async () => {
    if (!isConnected) return;
    try {
      setLoading(true); setError("");
      const provider = getProvider();
      const identity = getContract("IdentityRegistry", provider);
      const asset = getContract("AssetNFT", provider);
      const multisig = getContract("MultiSigAdmin", provider);

      const [issued, revoked, minted, transferred, proposed, confirmed, executed] = await Promise.all([
        identity.queryFilter(identity.filters.IdentityIssued(), 0, "latest"),
        identity.queryFilter(identity.filters.IdentityRevoked(), 0, "latest"),
        asset.queryFilter(asset.filters.AssetMinted(), 0, "latest"),
        asset.queryFilter(asset.filters.AssetTransferred(), 0, "latest"),
        multisig.queryFilter(multisig.filters.Proposed(), 0, "latest"),
        multisig.queryFilter(multisig.filters.Confirmed(), 0, "latest"),
        multisig.queryFilter(multisig.filters.Executed(), 0, "latest"),
      ]);

      const raw = [
        ...issued.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Identity", action: `Identity #${l.args.tokenId} issued`, account: l.args.owner })),
        ...revoked.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Identity", action: `Identity #${l.args.tokenId} revoked`, account: l.args.by })),
        ...minted.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Digital Asset", action: `Asset #${l.args.tokenId} minted`, account: l.args.owner })),
        ...transferred.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Digital Asset", action: `Asset #${l.args.tokenId} transferred`, account: l.args.to })),
        ...proposed.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Access", action: `Multisig proposal #${l.args.proposalId} created (${ACTIONS[Number(l.args.actionType)] || "Unknown"})`, account: l.args.proposer })),
        ...confirmed.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Access", action: `Multisig proposal #${l.args.proposalId} confirmed (${l.args.confirmations}/2)`, account: l.args.confirmer })),
        ...executed.map((l) => ({ block: l.blockNumber, tx: l.transactionHash, type: "Access", action: `Multisig proposal #${l.args.proposalId} executed`, account: "MultiSigAdmin" })),
      ];

      const withTimes = await Promise.all(raw.map(async (event, index) => {
        const block = await provider.getBlock(event.block);
        return { ...event, id: `${event.tx}-${index}`, time: block ? new Date(Number(block.timestamp) * 1000).toLocaleString() : "Unknown" };
      }));

      withTimes.sort((a, b) => b.block - a.block);
      setEvents(withTimes);
    } catch (err) {
      console.error(err); setError(err.shortMessage || err.message || "Could not read blockchain events.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadEvents(); }, [isConnected]);

  const visible = filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <section className="dashboard">
      <div className="section-title">
        <h2>Blockchain Audit Trail</h2>
        <p>Immutable events read directly from IdentityRegistry, AssetNFT and MultiSigAdmin.</p>
      </div>

      <div className="wallet-status" style={{ marginBottom: "1.5rem" }}>
        <strong>{loading ? "Reading blockchain events..." : `${events.length} on-chain events found`}</strong>
        <p style={{ marginTop: "0.5rem" }}>This page does not create or delete audit records. It reads events already stored on the blockchain.</p>
      </div>

      <div className="service-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          {["All", "Identity", "Digital Asset", "Access"].map((name) => <button key={name} className="card-btn" onClick={() => setFilter(name)} style={{ opacity: filter === name ? 1 : 0.55 }}>{name}</button>)}
          <button className="card-btn" onClick={loadEvents} disabled={loading}>Refresh Events</button>
        </div>
      </div>

      {error && <div className="wallet-status" style={{ marginBottom: "1.5rem" }}><p>Error: {error}</p></div>}

      <div className="service-card">
        <h3>Immutable Activity Log</h3>
        {visible.length === 0 ? <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>No matching blockchain events.</p> : visible.map((event) => (
          <div key={event.id} style={{ marginTop: "1rem", padding: "1.2rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}>
            <strong>{event.type}</strong>
            <p style={{ marginTop: "0.4rem" }}>{event.action}</p>
            <p style={{ marginTop: "0.4rem", color: "var(--text-muted)", fontFamily: "monospace" }}>Account: {event.account === "MultiSigAdmin" ? event.account : short(event.account)}</p>
            <p style={{ marginTop: "0.4rem", color: "var(--text-muted)" }}>Block: {event.block} · {event.time}</p>
            <p style={{ marginTop: "0.4rem", color: "var(--text-muted)", wordBreak: "break-all", fontSize: "0.8rem" }}>TX: {event.tx}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuditTrail;
