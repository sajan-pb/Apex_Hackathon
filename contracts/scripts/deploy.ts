import { network } from "hardhat";
import * as fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.create();
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
  const multiSigAddress = await multiSig.getAddress();
  console.log("MultiSigAdmin deployed to:", multiSigAddress);

  // --- Give MultiSigAdmin actual power over the other two contracts ---
  const DEFAULT_ADMIN_ROLE = await identityRegistry.DEFAULT_ADMIN_ROLE();
  const MANAGER_ROLE = await identityRegistry.MANAGER_ROLE();

  await (await identityRegistry.connect(admin).grantRole(DEFAULT_ADMIN_ROLE, multiSigAddress)).wait();
  await (await assetNFT.connect(admin).grantRole(DEFAULT_ADMIN_ROLE, multiSigAddress)).wait();
  await (await identityRegistry.connect(admin).grantRole(MANAGER_ROLE, multiSigAddress)).wait();
  console.log("MultiSigAdmin wired up: holds DEFAULT_ADMIN_ROLE on both contracts + MANAGER_ROLE on IdentityRegistry");

  // --- Remove the original admin's unilateral power — MultiSigAdmin is now the ONLY admin ---
  await (await identityRegistry.connect(admin).renounceRole(DEFAULT_ADMIN_ROLE, admin.address)).wait();
  await (await assetNFT.connect(admin).renounceRole(DEFAULT_ADMIN_ROLE, admin.address)).wait();
  console.log("Original admin renounced — MultiSigAdmin now holds sole admin power on both contracts");

  // --- Hand off addresses + ABIs so Member C's frontend can find everything ---
  const outputDir = path.join(__dirname, "..", "..", "backend", "shared");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "deployed-addresses.json"),
    JSON.stringify(
      {
        identityRegistry: identityRegistryAddress,
        assetNFT: assetNFTAddress,
        multiSigAdmin: multiSigAddress,
        network: "localhost",
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log("Wrote backend/shared/deployed-addresses.json");

  // --- Also copy straight into the frontend, so it never has to be hand-edited ---
  const frontendOutputDir = path.join(__dirname, "..", "..", "frontend", "src", "blockchain");
  fs.mkdirSync(frontendOutputDir, { recursive: true });
  fs.copyFileSync(
    path.join(outputDir, "deployed-addresses.json"),
    path.join(frontendOutputDir, "deployed-addresses.json")
  );
  console.log("Copied deployed-addresses.json into frontend/src/blockchain/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});