import { network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.connect();

  const signers = await ethers.getSigners();

  const admin = signers[0];
  const manager = signers[4];
  const user = signers[5];
  const user2 = signers[6];

  console.log("Admin:", admin.address);
  console.log("Manager/User #1:", manager.address);
  console.log("User #2:", user.address);
  console.log("User #3:", user2.address);

  const addressesPath = path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "shared",
    "deployed-addresses.json"
  );

  const addresses = JSON.parse(
    fs.readFileSync(addressesPath, "utf-8")
  );

  console.log("\nLoaded deployed addresses:");
  console.log(addresses);

  const identityRegistry = await ethers.getContractAt(
    "IdentityRegistry",
    addresses.identityRegistry
  );

  const assetNFT = await ethers.getContractAt(
    "AssetNFT",
    addresses.assetNFT
  );

  const docsDir = path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "data",
    "identity-docs"
  );

  const recipients = [
    manager,
    user,
    user2,
  ];

  const docFiles = [
    "identity-001.json",
    "identity-002.json",
    "identity-003.json",
  ];

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const docFile = docFiles[i];

    console.log(`\n--- Seeding ${docFile} ---`);

    const filePath = path.join(docsDir, docFile);
    const fileBytes = fs.readFileSync(filePath);

    const docHash = ethers.keccak256(fileBytes);

    const cid =
      `http://localhost:4000/identity-docs/${docFile}`;

    const existingIdentity =
      await identityRegistry.identityOf(recipient.address);

    if (existingIdentity !== 0n) {
      console.log(
        `Identity already exists for ${recipient.address}: token ${existingIdentity}`
      );
      continue;
    }

    const identityTx =
      await identityRegistry
        .connect(admin)
        .issueIdentity(
          recipient.address,
          cid,
          docHash
        );

    await identityTx.wait();

    const tokenId =
      await identityRegistry.identityOf(recipient.address);

    console.log(
      `Identity issued: ${recipient.address}`
    );

    console.log(
      `Identity token ID: ${tokenId}`
    );

    console.log(
      `Document hash: ${docHash}`
    );

    const assetTx =
      await assetNFT
        .connect(admin)
        .mintTo(
          recipient.address,
          `asset-metadata-${i + 1}.json`
        );

    await assetTx.wait();

    console.log(
      `Asset minted to: ${recipient.address}`
    );
  }

  console.log("\nSeed completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});