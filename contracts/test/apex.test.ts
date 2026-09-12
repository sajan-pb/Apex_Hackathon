import { expect } from "chai";
import { network } from "hardhat";

describe("Apex Identity & Asset system", function () {
  async function deployAll() {
    const { ethers } = await network.create();
    const [admin, alice, bob] = await ethers.getSigners();

    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const identity = await IdentityRegistry.deploy(admin.address);
    await identity.waitForDeployment();

    const AssetNFT = await ethers.getContractFactory("AssetNFT");
    const asset = await AssetNFT.deploy(admin.address, await identity.getAddress());
    await asset.waitForDeployment();

    return { ethers, admin, alice, bob, identity, asset };
  }

  it("issues an identity and blocks transferring it (soulbound)", async function () {
    const { ethers, admin, alice, identity } = await deployAll();

    await identity.connect(admin).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    expect(await identity.hasValidIdentity(alice.address)).to.equal(true);

    const tokenId = await identity.identityOf(alice.address);
    await expect(
      identity.connect(alice).transferFrom(alice.address, admin.address, tokenId)
    ).to.be.revertedWith("identity is soulbound: non-transferable");
  });

  it("blocks minting an asset to a wallet with no identity", async function () {
    const { admin, bob, asset } = await deployAll();

    await expect(
      asset.connect(admin).mintTo(bob.address, "ipfs://asset-cid")
    ).to.be.revertedWith("recipient has no valid identity");
  });

  it("mints successfully once the recipient has a valid identity", async function () {
    const { ethers, admin, alice, identity, asset } = await deployAll();

    await identity.connect(admin).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    await expect(asset.connect(admin).mintTo(alice.address, "ipfs://asset-cid")).to.not.revert(ethers);
  });

  it("blocks a non-manager from minting", async function () {
    const { ethers, alice, bob, asset } = await deployAll();
    await expect(asset.connect(bob).mintTo(alice.address, "ipfs://asset-cid")).to.revert(ethers);
  });

  it("blocks minting once an identity has been revoked", async function () {
    const { ethers, admin, alice, identity, asset } = await deployAll();

    await identity.connect(admin).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    const tokenId = await identity.identityOf(alice.address);
    await identity.connect(admin).revokeIdentity(tokenId);

    expect(await identity.hasValidIdentity(alice.address)).to.equal(false);
    await expect(
      asset.connect(admin).mintTo(alice.address, "ipfs://asset-cid")
    ).to.be.revertedWith("recipient has no valid identity");
  });

  it("blocks transferring an owned asset to a wallet with no identity", async function () {
    const { ethers, admin, alice, bob, identity, asset } = await deployAll();

    await identity.connect(admin).issueIdentity(alice.address, "ipfs://demo-cid", ethers.ZeroHash);
    await asset.connect(admin).mintTo(alice.address, "ipfs://asset-cid");
    const assetId = 1;

    await expect(
      asset.connect(alice).transferFrom(alice.address, bob.address, assetId)
    ).to.be.revertedWith("recipient has no valid identity");
  });
});