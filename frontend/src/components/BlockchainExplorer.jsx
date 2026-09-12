import { useState } from "react";

function BlockchainExplorer({ setCurrentPage }) {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState(null);

  const searchBlockchain = () => {
    const value = searchValue.trim();

    if (!value) {
      setResult({
        type: "error",
        title: "Search Required",
        message: "Please enter a transaction hash, wallet address, or block number."
      });
      return;
    }

    // Transaction Hash
    if (/^0x[a-fA-F0-9]{64}$/.test(value)) {
      setResult({
        type: "success",
        title: "Transaction Found",
        message: "Valid blockchain transaction hash detected.",
        value: value
      });
      return;
    }

    // Wallet Address
    if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setResult({
        type: "success",
        title: "Wallet Address Found",
        message: "Valid Ethereum wallet address detected.",
        value: value
      });
      return;
    }

    // Block Number
    if (/^\d+$/.test(value)) {
      setResult({
        type: "success",
        title: "Block Found",
        message: `Block number ${value} is ready for lookup.`,
        value: value
      });
      return;
    }

    // Invalid
    setResult({
      type: "error",
      title: "Invalid Search",
      message:
        "Enter a valid transaction hash, wallet address, or block number."
    });
  };

  return (
    <section className="dashboard">

      <button
        className="card-btn"
        onClick={() => setCurrentPage("dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="section-title">
        <h2>Blockchain Explorer</h2>

        <p>
          Search and explore blockchain transactions,
          wallet addresses and block information.
        </p>
      </div>

      <div className="verification-container">

        <div className="service-card verification-card">

          <div className="card-icon">
            ⛓️
          </div>

          <h3>Explore Blockchain</h3>

          <p>
            Enter a transaction hash, wallet address,
            or block number.
          </p>

          <input
            type="text"
            className="transaction-input"
            placeholder="Transaction / Wallet / Block Number"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.target.value)
            }
          />

          <button
            className="card-btn"
            onClick={searchBlockchain}
          >
            Search Blockchain →
          </button>

          {result && (
            <div
              className={`verification-result ${result.type}`}
            >

              <h3>
                {result.type === "success"
                  ? "✓ " + result.title
                  : "⚠ " + result.title}
              </h3>

              <p>{result.message}</p>

              {result.value && (
                <div className="hash-result">
                  <strong>Search Value:</strong>

                  <p>{result.value}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default BlockchainExplorer;