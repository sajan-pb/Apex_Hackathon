import { useState } from "react";

function TransactionVerification({
  setCurrentPage,
  walletAddress,
  isConnected,
  addActivity,
}) {
  const [transactionHash, setTransactionHash] =
    useState("");

  const [result, setResult] = useState(null);

  const verifyTransaction = () => {
    const hash = transactionHash.trim();

    if (!hash) {
      setResult({
        type: "error",
        message:
          "Please enter a transaction hash.",
      });

      return;
    }

    const hashPattern =
      /^0x[a-fA-F0-9]{64}$/;

    if (!hashPattern.test(hash)) {
      setResult({
        type: "error",
        message:
          "Invalid transaction hash. Enter a valid hash starting with 0x followed by 64 hexadecimal characters.",
      });

      if (addActivity) {
        addActivity(
          "Transaction",
          "Transaction verification failed due to invalid hash format."
        );
      }

      return;
    }

    setResult({
      type: "success",
      message:
        "Transaction hash format is valid.",
      hash: hash,
    });

    if (addActivity) {
      addActivity(
        "Transaction",
        `Transaction hash verified successfully: ${hash.slice(
          0,
          12
        )}...`
      );
    }
  };

  return (
    <section className="dashboard">
      <button
        className="card-btn"
        onClick={() =>
          setCurrentPage("dashboard")
        }
      >
        ← Back to Dashboard
      </button>

      <div className="section-title">
        <h2>Transaction Verification</h2>

        <p>
          Verify blockchain transaction information
          securely.
        </p>
      </div>

      {isConnected ? (
        <div
          className="wallet-status"
          style={{ marginBottom: "2rem" }}
        >
          <strong>
            🟢 Wallet Connected
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
          }}
        >
          <strong style={{ color: "#fca5a5" }}>
            ⚠️ Wallet Not Connected
          </strong>

          <p>
            Transaction hash format can still be
            checked locally.
          </p>
        </div>
      )}

      <div className="verification-container">
        <div className="service-card verification-card">
          <div className="card-icon">🔍</div>

          <h3>Verify Transaction</h3>

          <p>
            Enter a blockchain transaction hash to
            verify its format.
          </p>

          <input
            type="text"
            className="transaction-input"
            placeholder="Enter transaction hash (0x...)"
            value={transactionHash}
            onChange={(event) =>
              setTransactionHash(event.target.value)
            }
          />

          <button
            className="card-btn"
            onClick={verifyTransaction}
          >
            Verify Transaction →
          </button>

          {result && (
            <div
              className={`verification-result ${result.type}`}
            >
              <h3>
                {result.type === "success"
                  ? "✓ Verification Successful"
                  : "⚠ Verification Failed"}
              </h3>

              <p>{result.message}</p>

              {result.hash && (
                <div className="hash-result">
                  <strong>
                    Transaction Hash:
                  </strong>

                  <p>{result.hash}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="wallet-status"
        style={{ marginTop: "2rem" }}
      >
        <strong>
          ⛓️ Transaction Verification Status
        </strong>

        <p
          style={{
            marginTop: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Verification events are recorded in the
          platform Audit Trail. Full blockchain
          transaction lookup can be added through
          smart contract or blockchain provider
          integration.
        </p>
      </div>
    </section>
  );
}

export default TransactionVerification;