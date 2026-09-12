import React from "react";

function ServiceCards({ setCurrentPage }) {
  return (
    <section className="dashboard" id="services">

      <div className="section-title">
        <h2>Blockchain Services</h2>

        <p>
          Explore powerful tools designed for
          secure blockchain management.
        </p>
      </div>


      <div className="card-grid">

        {/* Transaction Verification */}

        <div className="service-card">

          <div className="card-icon">
            🔍
          </div>

          <h3>
            Transaction Verification
          </h3>

          <p>
            Verify blockchain transactions
            quickly and securely.
          </p>

          <button
            className="card-btn"
            onClick={() => setCurrentPage("verification")}
          >
            Verify Transaction →
          </button>

        </div>


        {/* Blockchain Explorer */}

        <div className="service-card">

          <div className="card-icon">
            ⛓️
          </div>

          <h3>
            Blockchain Explorer
          </h3>

          <p>
            Explore blocks, transactions
            and blockchain network data.
          </p>

          <button
            className="card-btn"
            onClick={() => setCurrentPage("explorer")}
          >
            Explore Blockchain →
          </button>

        </div>


        {/* Security Monitoring */}

        <div className="service-card">

          <div className="card-icon">
            🛡️
          </div>

          <h3>
            Security Monitoring
          </h3>

          <p>
            Monitor blockchain activity and
            identify potential security risks.
          </p>

          <button
            className="card-btn"
            onClick={() => setCurrentPage("security")}
          >
            Monitor Security →
          </button>

        </div>


        {/* Audit Trail */}

        <div className="service-card">

          <div className="card-icon">
            📜
          </div>

          <h3>
            Audit Trail
          </h3>

          <p>
            Monitor and verify important
            blockchain activities and transactions.
          </p>

          <button
            className="card-btn"
            onClick={() => setCurrentPage("audit")}
          >
            View Audit Trail →
          </button>

        </div>

      </div>

    </section>
  );
}

export default ServiceCards;