import { network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = await network.connect();
  const [admin, , , , manager, user] = await ethers.getSigners();

  const addresses = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "..", "backend", "shared", "deployed-addresses.json"),
      "utf-8"
    )
  );
  console.log("Loaded addresses:", addresses);
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", addresses.identityRegistry);
  const assetNFT = await ethers.getContractAt("AssetNFT", addresses.assetNFT);

  const docsDir = path.join(__dirname, "..", "..", "backend", "data", "identity-docs");
  const recipients = [manager, user];
  const docFiles = ["identity-001.json", "identity-002.json"];

  for (let i = 0; i < recipients.length; i++) {
    const filePath = path.join(docsDir, docFiles[i]);
    const fileBytes = fs.readFileSync(filePath);
    const docHash = ethers.keccak256(fileBytes);
    const cid = `http://localhost:4000/identity-docs/${docFiles[i]}`;

    const tx = await identityRegistry.connect(admin).issueIdentity(recipients[i].address, cid, docHash);
    await tx.wait();
    console.log(`Issued identity to ${recipients[i].address} (${docFiles[i]})`);

    const mintTx = await assetNFT.connect(admin).mintTo(recipients[i].address, `asset-metadata-${i + 1}.json`);
    await mintTx.wait();
    console.log(`Minted asset to ${recipients[i].address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});