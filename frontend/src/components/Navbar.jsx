import React from "react";

function Navbar({
  isConnected,
  walletAddress,
  connectWallet,
  setCurrentPage,
}) {

  const shortenAddress = (address) => {

    if (!address) return "";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;

  };


  const goHome = () => {

    setCurrentPage("dashboard");

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }, 100);

  };


  const goToServices = () => {

    setCurrentPage("dashboard");

    setTimeout(() => {

      const services =
        document.getElementById("services");

      if (services) {

        services.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 150);

  };


  return (

    <nav className="navbar">

      <div
        className="logo"
        onClick={goHome}
        style={{
          cursor: "pointer",
        }}
      >

        <span className="logo-icon">
          ⛓️
        </span>

        <span className="logo-text">
          ApexChain
        </span>

      </div>


      <div className="nav-links">

        <button onClick={goHome}>
          Home
        </button>

        <button onClick={goToServices}>
          Services
        </button>

        <button
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            setCurrentPage("audit")
          }
        >
          Audit Trail
        </button>

      </div>


      <button
        className="wallet-button"
        onClick={connectWallet}
      >

        <span className="status-indicator"></span>

        {isConnected
          ? shortenAddress(walletAddress)
          : "Connect Wallet"}

      </button>

    </nav>

  );
}

export default Navbar;