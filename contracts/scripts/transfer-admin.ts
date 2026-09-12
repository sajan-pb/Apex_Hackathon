import { network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.connect();
  const [admin] = await ethers.getSigners();

  const addresses = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "..", "backend", "shared", "deployed-addresses.json"),
      "utf-8"
    )
  );

  const identityRegistry = await ethers.getContractAt("IdentityRegistry", addresses.IdentityRegistry);
  const assetNFT = await ethers.getContractAt("AssetNFT", addresses.AssetNFT);

  const DEFAULT_ADMIN_ROLE = await identityRegistry.DEFAULT_ADMIN_ROLE();
  const multiSigAddress = addresses.MultiSigAdmin;

  let tx = await identityRegistry.connect(admin).grantRole(DEFAULT_ADMIN_ROLE, multiSigAddress);
  await tx.wait();
  console.log("Granted DEFAULT_ADMIN_ROLE on IdentityRegistry to MultiSigAdmin");

  tx = await assetNFT.connect(admin).grantRole(DEFAULT_ADMIN_ROLE, multiSigAddress);
  await tx.wait();
  console.log("Granted DEFAULT_ADMIN_ROLE on AssetNFT to MultiSigAdmin");

  tx = await identityRegistry.connect(admin).renounceRole(DEFAULT_ADMIN_ROLE, admin.address);
  await tx.wait();
  console.log("Original admin renounced DEFAULT_ADMIN_ROLE on IdentityRegistry");

  tx = await assetNFT.connect(admin).renounceRole(DEFAULT_ADMIN_ROLE, admin.address);
  await tx.wait();
  console.log("Original admin renounced DEFAULT_ADMIN_ROLE on AssetNFT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});