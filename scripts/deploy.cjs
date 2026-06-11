const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;

  console.log(`\nDeploying AgentX contracts...`);
  console.log(`Network: ${network} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${(await hre.ethers.getSigners())[0].address}\n`);

  // Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("AgentRegistry deployed to:", agentRegistryAddress);

  // Deploy ERC8004Identity
  console.log("Deploying ERC8004Identity...");
  const ERC8004Identity = await hre.ethers.getContractFactory("ERC8004Identity");
  const erc8004 = await ERC8004Identity.deploy();
  await erc8004.waitForDeployment();
  const erc8004Address = await erc8004.getAddress();
  console.log("ERC8004Identity deployed to:", erc8004Address);

  // Deploy AgentXVault (renamed from MantleMindVault)
  console.log("Deploying AgentXVault...");
  const AgentXVault = await hre.ethers.getContractFactory("MantleMindVault");
  const vault = await AgentXVault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("AgentXVault deployed to:", vaultAddress);

  // Summary
  console.log("\n=== AgentX CONTRACTS DEPLOYED ===");
  console.log(`Network:        ${network}`);
  console.log(`Chain ID:       ${chainId}`);
  console.log(`AgentRegistry:  ${agentRegistryAddress}`);
  console.log(`ERC8004Identity:${erc8004Address}`);
  console.log(`AgentXVault:    ${vaultAddress}`);

  // Save to deployments file
  const deployments = {
    network,
    chainId,
    deployedAt: new Date().toISOString(),
    contracts: {
      AgentRegistry: agentRegistryAddress,
      ERC8004Identity: erc8004Address,
      AgentXVault: vaultAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  
  const outFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deployments, null, 2));
  console.log(`\nDeployment saved to: deployments/${network}.json`);

  // Print .env values to add
  console.log("\n=== ADD TO .env ===");
  console.log(`VITE_AGENT_REGISTRY=${agentRegistryAddress}`);
  console.log(`VITE_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`VITE_IDENTITY_ADDRESS=${erc8004Address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
