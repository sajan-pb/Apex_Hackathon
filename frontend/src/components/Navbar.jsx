function Navbar({ isConnected, walletAddress, connectWallet, setCurrentPage }) {
  const shorten = (address) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setCurrentPage("dashboard")} style={{ cursor: "pointer" }}>
        <span className="logo-icon">⛓️</span><span className="logo-text">ApexChain</span>
      </div>
      <div className="nav-links">
        <button onClick={() => setCurrentPage("dashboard")}>Home</button>
        <button onClick={() => setCurrentPage("identity")}>Identity</button>
        <button onClick={() => setCurrentPage("assets")}>Assets</button>
        <button onClick={() => setCurrentPage("access")}>RBAC</button>
        <button onClick={() => setCurrentPage("audit")}>Audit Trail</button>
      </div>
      <button className="wallet-button" onClick={connectWallet}>
        <span className="status-indicator"></span>{isConnected ? shorten(walletAddress) : "Connect Wallet"}
      </button>
    </nav>
  );
}
export default Navbar;
