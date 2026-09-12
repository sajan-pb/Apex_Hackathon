import { expect } from "chai";
import { network } from "hardhat";

describe("MultiSigAdmin", function () {
  async function deployAll() {
    const { ethers } = await network.create();
    const [deployer, admin0, admin1, admin2, alice] = await ethers.getSigners();

    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const identity = await IdentityRegistry.deploy(deployer.address);
    await identity.waitForDeployment();

    const AssetNFT = await ethers.getContractFactory("AssetNFT");
    const asset = await AssetNFT.deploy(deployer.address, await identity.getAddress());
    await asset.waitForDeployment();

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multisig = await MultiSigAdmin.deploy(admin0.address, admin1.address, admin2.address);
    await multisig.waitForDeployment();
    const multisigAddress = await multisig.getAddress();

    const DEFAULT_ADMIN_ROLE = await identity.DEFAULT_ADMIN_ROLE();
    const MANAGER_ROLE = await identity.MANAGER_ROLE();
    await identity.connect(deployer).grantRole(DEFAULT_ADMIN_ROLE, multisigAddress);
    await identity.connect(deployer).grantRole(MANAGER_ROLE, multisigAddress);

    return { ethers, deployer, admin0, admin1, admin2, alice, identity, asset, multisig, MANAGER_ROLE };
  }

  it("blocks a non-admin from proposing", async function () {
    const { ethers, alice, identity, multisig } = await deployAll();
    const identityAddress = await identity.getAddress();
    await expect(
      multisig.connect(alice).propose(2, identityAddress, ethers.ZeroHash, alice.address)
    ).to.be.revertedWith("not a designated admin");
  });

  it("does NOT execute after only one confirmation", async function () {
    const { ethers, deployer, admin0, alice, identity, multisig } = await deployAll();
    await identity.connect(deployer).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    const identityAddress = await identity.getAddress();

    await multisig.connect(admin0).propose(2, identityAddress, ethers.ZeroHash, alice.address);

    // proposer's auto-confirm is only 1 of 2 needed — identity must still be valid
    expect(await identity.hasValidIdentity(alice.address)).to.equal(true);
  });

  it("revokes an identity once a second admin confirms", async function () {
    const { ethers, deployer, admin0, admin1, alice, identity, multisig } = await deployAll();
    await identity.connect(deployer).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    const identityAddress = await identity.getAddress();

    await multisig.connect(admin0).propose(2, identityAddress, ethers.ZeroHash, alice.address);
    await multisig.connect(admin1).confirm(0);

    expect(await identity.hasValidIdentity(alice.address)).to.equal(false);
  });

  it("grants a role once 2 of 3 admins confirm", async function () {
    const { ethers, admin0, admin1, alice, identity, multisig, MANAGER_ROLE } = await deployAll();
    const identityAddress = await identity.getAddress();

    await multisig.connect(admin0).propose(0, identityAddress, MANAGER_ROLE, alice.address);
    expect(await identity.hasRole(MANAGER_ROLE, alice.address)).to.equal(false);

    await multisig.connect(admin1).confirm(0);
    expect(await identity.hasRole(MANAGER_ROLE, alice.address)).to.equal(true);
  });

  it("blocks the same admin from confirming twice", async function () {
    const { ethers, deployer, admin0, alice, identity, multisig } = await deployAll();
    await identity.connect(deployer).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    const identityAddress = await identity.getAddress();

    await multisig.connect(admin0).propose(2, identityAddress, ethers.ZeroHash, alice.address);
    await expect(multisig.connect(admin0).confirm(0)).to.be.revertedWith("already confirmed by you");
  });
});