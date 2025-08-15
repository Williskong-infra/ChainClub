const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting ChainClub NFT contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Contract parameters
  const contractName = "ChainClub Member Card";
  const contractSymbol = "CCMC";
  const baseTokenURI = "ipfs://"; // Base URI for token metadata

  console.log("\n📋 Contract Parameters:");
  console.log("Name:", contractName);
  console.log("Symbol:", contractSymbol);
  console.log("Base Token URI:", baseTokenURI);

  // Deploy the ChainClubNFT contract
  console.log("\n🔨 Deploying ChainClubNFT contract...");
  const ChainClubNFT = await ethers.getContractFactory("ChainClubNFT");
  const chainClubNFT = await ChainClubNFT.deploy(contractName, contractSymbol, baseTokenURI);

  await chainClubNFT.deployed();

  console.log("✅ ChainClubNFT deployed to:", chainClubNFT.address);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  const name = await chainClubNFT.name();
  const symbol = await chainClubNFT.symbol();
  const owner = await chainClubNFT.owner();
  const maxSupply = await chainClubNFT.MAX_SUPPLY();
  const totalSupply = await chainClubNFT.totalSupply();

  console.log("✅ Contract verification:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Owner:", owner);
  console.log("   Max Supply:", maxSupply.toString());
  console.log("   Total Supply:", totalSupply.toString());

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractName: "ChainClubNFT",
    contractAddress: chainClubNFT.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    parameters: {
      name: contractName,
      symbol: contractSymbol,
      baseTokenURI: baseTokenURI,
      maxSupply: maxSupply.toString(),
    },
    verification: {
      name: name,
      symbol: symbol,
      owner: owner,
      totalSupply: totalSupply.toString(),
    }
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  const path = require("path");
  
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentDir, `${hre.network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Instructions for verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔗 Next steps:");
    console.log("1. Verify contract on Etherscan:");
    console.log(`   npx hardhat verify --network ${hre.network.name} ${chainClubNFT.address} "${contractName}" "${contractSymbol}" "${baseTokenURI}"`);
    
    console.log("\n2. Update your environment variables:");
    console.log(`   NFT_CONTRACT_ADDRESS=${chainClubNFT.address}`);
    
    console.log("\n3. Test the contract:");
    console.log("   npx hardhat test");
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
