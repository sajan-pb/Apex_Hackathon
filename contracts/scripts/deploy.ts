import { network } from "hardhat";

async function main() {
  console.log("\n🚀 Starting ApexChain contract deployment...\n");

  // Connect to Hardhat Runtime Environment
  const { ethers } = await network.connect();

  // Get available accounts
  const [deployer, admin1, admin2] =
    await ethers.getSigners();

  console.log("Deploying contracts with:");
  console.log("Admin 0:", deployer.address);
  console.log("Admin 1:", admin1.address);
  console.log("Admin 2:", admin2.address);

  // ==========================================
  // DEPLOY IDENTITY REGISTRY
  // ==========================================

  console.log("\n📋 Deploying IdentityRegistry...");

  const IdentityRegistry =
    await ethers.getContractFactory(
      "IdentityRegistry"
    );

  const identityRegistry =
    await IdentityRegistry.deploy(
      deployer.address
    );

  await identityRegistry.waitForDeployment();

  const identityRegistryAddress =
    await identityRegistry.getAddress();

  console.log(
    "✅ IdentityRegistry deployed at:",
    identityRegistryAddress
  );


  // ==========================================
  // DEPLOY ASSET NFT
  // ==========================================

  console.log("\n💎 Deploying AssetNFT...");

  const AssetNFT =
    await ethers.getContractFactory(
      "AssetNFT"
    );

  const assetNFT =
    await AssetNFT.deploy(
      deployer.address,
      identityRegistryAddress
    );

  await assetNFT.waitForDeployment();

  const assetNFTAddress =
    await assetNFT.getAddress();

  console.log(
    "✅ AssetNFT deployed at:",
    assetNFTAddress
  );


  // ==========================================
  // DEPLOY MULTISIG ADMIN
  // ==========================================

  console.log("\n🔐 Deploying MultiSigAdmin...");

  const MultiSigAdmin =
    await ethers.getContractFactory(
      "MultiSigAdmin"
    );

  const multiSigAdmin =
    await MultiSigAdmin.deploy(
      deployer.address,
      admin1.address,
      admin2.address
    );

  await multiSigAdmin.waitForDeployment();

  const multiSigAdminAddress =
    await multiSigAdmin.getAddress();

  console.log(
    "✅ MultiSigAdmin deployed at:",
    multiSigAdminAddress
  );


  // ==========================================
  // FINAL SUMMARY
  // ==========================================

  console.log("\n====================================");
  console.log("🎉 APEXCHAIN DEPLOYMENT COMPLETE");
  console.log("====================================\n");

  console.log("IdentityRegistry:");
  console.log(identityRegistryAddress);

  console.log("\nAssetNFT:");
  console.log(assetNFTAddress);

  console.log("\nMultiSigAdmin:");
  console.log(multiSigAdminAddress);

  console.log("\nNetwork:");
  console.log((await ethers.provider.getNetwork()).name);

  console.log("\n====================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});