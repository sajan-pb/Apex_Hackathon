import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [admin, admin1, admin2, admin3] = await ethers.getSigners();

  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(admin.address);
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("IdentityRegistry deployed to:", identityRegistryAddress);

  const AssetNFT = await ethers.getContractFactory("AssetNFT");
  const assetNFT = await AssetNFT.deploy(admin.address, identityRegistryAddress);
  await assetNFT.waitForDeployment();
  const assetNFTAddress = await assetNFT.getAddress();
  console.log("AssetNFT deployed to:", assetNFTAddress);

  const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
  const multiSig = await MultiSigAdmin.deploy(admin1.address, admin2.address, admin3.address);
  await multiSig.waitForDeployment();
  console.log("MultiSigAdmin deployed to:", await multiSig.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});