const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainClub NFT Contract to Polygon Amoy...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get balance using provider
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC\n");

  // Contract parameters
  const contractName = "ChainClub Membership";
  const contractSymbol = "CCM";
  const baseURI = "https://ipfs.io/ipfs/"; // Base URI for metadata

  console.log("📋 Contract Parameters:");
  console.log("- Name:", contractName);
  console.log("- Symbol:", contractSymbol);
  console.log("- Base URI:", baseURI);
  console.log("");

  // Deploy the contract
  console.log("🏗️ Deploying ChainClubNFT contract...");
  const ChainClubNFT = await ethers.getContractFactory("ChainClubNFT");
  const nftContract = await ChainClubNFT.deploy(contractName, contractSymbol, baseURI);

  console.log("⏳ Waiting for deployment confirmation...");
  await nftContract.waitForDeployment();

  const contractAddress = await nftContract.getAddress();
  console.log("✅ ChainClubNFT deployed to:", contractAddress);
  console.log("🔗 Contract on Amoy Explorer: https://www.oklink.com/amoy/address/" + contractAddress);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const name = await nftContract.name();
  const symbol = await nftContract.symbol();
  const owner = await nftContract.owner();
  const mintingFee = await nftContract.mintingFee();
  const maxSupply = await nftContract.maxSupply();

  console.log("✅ Contract verification:");
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Owner:", owner);
  console.log("- Minting Fee:", ethers.formatEther(mintingFee), "MATIC");
  console.log("- Max Supply:", maxSupply.toString());

  // Save deployment info
  const deploymentInfo = {
    network: "Polygon Amoy Testnet",
    contractAddress: contractAddress,
    deployer: deployer.address,
    contractName: contractName,
    contractSymbol: contractSymbol,
    baseURI: baseURI,
    deploymentTime: new Date().toISOString(),
    blockExplorer: `https://www.oklink.com/amoy/address/${contractAddress}`
  };

  console.log("\n📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your server/.env file with NFT_CONTRACT_ADDRESS");
  console.log("3. Verify the contract on Amoy Explorer");
  console.log("4. Test minting functionality");

  return nftContract;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
