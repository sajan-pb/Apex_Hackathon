import { useState } from "react";

function AuditTrail({
  walletAddress,
  isConnected,
  activities,
  addActivity,
  clearActivities,
}) {
  const [filter, setFilter] = useState("All");

  const activityTypes = [
    "Identity",
    "Digital Asset",
    "Access",
    "Transaction",
  ];

  const recordActivity = (type) => {
    if (!isConnected) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    addActivity(
      type,
      `${type} activity recorded on the platform`
    );
  };

  const shortenAddress = (address) => {
    if (!address) return "Unknown";

    if (address.length < 15) {
      return address;
    }

    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const filteredActivities =
    filter === "All"
      ? activities
      : activities.filter(
          (activity) =>
            activity.type === filter
        );

  return (
    <div>

      {/* TITLE */}

      <div
        className="section-title"
        style={{ marginBottom: "2rem" }}
      >
        <h2>
          Blockchain Audit Trail
        </h2>

        <p>
          Monitor and verify important blockchain
          activities and platform events.
        </p>
      </div>


      {/* WALLET STATUS */}

      {isConnected ? (

        <div
          className="wallet-status"
          style={{ marginBottom: "2rem" }}
        >

          <strong>
            🟢 Audit Monitoring Active
          </strong>

          <p
            style={{
              marginTop: "0.5rem",
              wordBreak: "break-all",
            }}
          >
            Connected Wallet: {walletAddress}
          </p>

        </div>

      ) : (

        <div
          className="wallet-status"
          style={{
            marginBottom: "2rem",
            background:
              "rgba(239, 68, 68, 0.1)",
          }}
        >

          <strong
            style={{
              color: "#fca5a5",
            }}
          >
            ⚠️ Wallet Not Connected
          </strong>

          <p
            style={{
              marginTop: "0.5rem",
            }}
          >
            Connect MetaMask to record
            blockchain activities.
          </p>

        </div>

      )}


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
          style={{
            padding: "1.5rem",
          }}
        >

          <h3>
            {activities.length}
          </h3>

          <p>
            Total Activities
          </p>

        </div>


        <div
          className="service-card"
          style={{
            padding: "1.5rem",
          }}
        >

          <h3>
            {
              activities.filter(
                (activity) =>
                  activity.type === "Identity"
              ).length
            }
          </h3>

          <p>
            Identity Events
          </p>

        </div>


        <div
          className="service-card"
          style={{
            padding: "1.5rem",
          }}
        >

          <h3>
            {
              activities.filter(
                (activity) =>
                  activity.type ===
                  "Digital Asset"
              ).length
            }
          </h3>

          <p>
            Asset Events
          </p>

        </div>


        <div
          className="service-card"
          style={{
            padding: "1.5rem",
          }}
        >

          <h3>
            🟢
          </h3>

          <p>
            Audit System Active
          </p>

        </div>

      </div>


      {/* RECORD ACTIVITY */}

      <div
        className="service-card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >

        <div className="card-icon">
          ➕
        </div>

        <h3>
          Record Activity
        </h3>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Add a new activity to the
          blockchain audit trail.
        </p>


        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >

          {activityTypes.map((type) => (

            <button
              key={type}
              className="card-btn"
              onClick={() =>
                recordActivity(type)
              }
            >
              + {type} Event
            </button>

          ))}

        </div>

      </div>


      {/* FILTER */}

      <div
        className="service-card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >

        <h3>
          Filter Activities
        </h3>


        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginTop: "1rem",
          }}
        >

          {[
            "All",
            "System",
            "Wallet",
            ...activityTypes,
          ].map((type) => (

            <button
              key={type}
              className="card-btn"
              onClick={() =>
                setFilter(type)
              }
              style={{
                opacity:
                  filter === type
                    ? "1"
                    : "0.6",
              }}
            >
              {type}
            </button>

          ))}

        </div>

      </div>


      {/* AUDIT LOG */}

      <div
        className="service-card"
        style={{
          padding: "2rem",
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
            marginBottom: "1.5rem",
          }}
        >

          <div>

            <h3>
              Activity Log
            </h3>

            <p
              style={{
                color:
                  "var(--text-muted)",
              }}
            >
              Showing{" "}
              {filteredActivities.length}{" "}
              activities
            </p>

          </div>


          {activities.length > 0 && (

            <button
              className="card-btn"
              onClick={clearActivities}
            >
              Clear Audit Trail
            </button>

          )}

        </div>


        {filteredActivities.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color:
                "var(--text-muted)",
            }}
          >

            <div
              style={{
                fontSize: "3rem",
              }}
            >
              📜
            </div>

            <p>
              No audit activities found.
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

            {filteredActivities.map(
              (activity) => (

                <div
                  key={activity.id}
                  style={{
                    background:
                      "rgba(255,255,255,0.03)",

                    border:
                      "1px solid rgba(255,255,255,0.1)",

                    borderRadius:
                      "10px",

                    padding: "1.5rem",
                  }}
                >

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      flexWrap: "wrap",

                      gap: "1rem",
                    }}
                  >

                    <div>

                      <p
                        style={{
                          color:
                            "var(--accent-cyan)",

                          fontWeight:
                            "bold",

                          marginBottom:
                            "0.5rem",
                        }}
                      >
                        ⛓️ {activity.type}
                      </p>


                      <h4>
                        {activity.action}
                      </h4>


                      <p
                        style={{
                          color:
                            "var(--text-muted)",

                          fontSize:
                            "0.85rem",

                          marginTop:
                            "0.5rem",
                        }}
                      >
                        User:{" "}

                        {activity.user ===
                        "System"
                          ? "System"
                          : shortenAddress(
                              activity.user
                            )}
                      </p>


                      <p
                        style={{
                          color:
                            "var(--text-muted)",

                          fontSize:
                            "0.8rem",

                          marginTop:
                            "0.3rem",
                        }}
                      >
                        {activity.time}
                      </p>

                    </div>


                    <div>

                      <span
                        style={{
                          padding:
                            "6px 12px",

                          borderRadius:
                            "20px",

                          background:
                            "rgba(34,197,94,0.1)",

                          color:
                            "#86efac",

                          fontSize:
                            "0.8rem",
                        }}
                      >
                        ✓ {activity.status}
                      </span>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* BLOCKCHAIN INFORMATION */}

      <div
        className="wallet-status"
        style={{
          marginTop: "2rem",
        }}
      >

        <strong>
          🔗 Blockchain Audit Information
        </strong>

        <p
          style={{
            marginTop: "0.7rem",
            color:
              "var(--text-muted)",
          }}
        >
          Activities from Identity Management,
          Digital Asset Vault and other platform
          modules are recorded in this shared
          audit trail.
        </p>

      </div>

    </div>
  );
}

export default AuditTrail;