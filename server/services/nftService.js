const { ethers } = require('ethers');
const { prisma } = require('../config/database');

// Initialize IPFS client with proper configuration
let ipfs = null;

// Try to initialize IPFS client, but don't fail if it doesn't work
try {
  const { create } = require('ipfs-http-client');
  ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(
        `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
      ).toString('base64')}`
    }
  });
} catch (error) {
  console.warn('IPFS client initialization failed:', error.message);
  console.warn('NFT metadata will use mock IPFS hashes for development');
}

// Upload metadata to IPFS
async function uploadMetadataToIPFS(metadata) {
  try {
    if (!ipfs) {
      // Return a mock IPFS hash for development
      console.log('Using mock IPFS hash for development');
      return 'QmMockIPFSHashForDevelopment' + Date.now();
    }
    
    const result = await ipfs.add(JSON.stringify(metadata));
    return result.path;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    // For development, return a mock IPFS hash
    return 'QmMockIPFSHashForDevelopment' + Date.now();
  }
}

// Generate NFT metadata
function generateNFTMetadata(user, tokenId) {
  const creationDate = new Date().toISOString().split('T')[0];
  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.email.split('@')[0];

  return {
    name: `${userName}'s ChainClub Membership`,
    description: `Welcome to ChainClub! This is ${userName}'s exclusive membership card. Join our community of blockchain enthusiasts and innovators.`,
    image: `https://ipfs.io/ipfs/QmYourImageHashHere`, // Replace with actual image hash
    attributes: [
      {
        trait_type: "Member Name",
        value: userName
      },
      {
        trait_type: "Membership Level",
        value: "Level 1 Member"
      },
      {
        trait_type: "Member Since",
        value: creationDate
      },
      {
        trait_type: "Member ID",
        value: user.id.toString()
      },
      {
        trait_type: "Membership Type",
        value: "Founding Member"
      },
      {
        trait_type: "Status",
        value: "Active"
      }
    ],
    external_url: "https://chainclub.com",
    background_color: "000000"
  };
}

// Store NFT in database
async function storeNFT(userId, tokenId, metadata, contractAddress) {
  try {
    const nft = await prisma.nFT.create({
      data: {
        userId,
        tokenId,
        name: metadata.name,
        description: metadata.description,
        imageUrl: metadata.image,
        metadataUrl: `ipfs://${metadata.ipfsHash}`,
        contractAddress,
        network: 'sepolia',
        isMinted: false
      }
    });

    return nft;
  } catch (error) {
    console.error('Error storing NFT:', error);
    throw new Error('Failed to store NFT');
  }
}

// Update NFT minting status
async function updateNFTMintingStatus(tokenId, transactionHash, blockNumber) {
  try {
    const nft = await prisma.nFT.update({
      where: { tokenId },
      data: {
        isMinted: true,
        mintedAt: new Date()
      }
    });

    return nft;
  } catch (error) {
    console.error('Error updating NFT minting status:', error);
    throw new Error('Failed to update NFT minting status');
  }
}

// Get NFTs by user ID
async function getNFTsByUserId(userId) {
  try {
    const nfts = await prisma.nFT.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return nfts;
  } catch (error) {
    console.error('Error getting NFTs by user ID:', error);
    throw new Error('Failed to get NFTs');
  }
}

// Get NFT by token ID
async function getNFTByTokenId(tokenId) {
  try {
    const nft = await prisma.nFT.findUnique({
      where: { tokenId }
    });

    return nft;
  } catch (error) {
    console.error('Error getting NFT by token ID:', error);
    throw new Error('Failed to get NFT');
  }
}

// Check if user has already minted an NFT
async function hasUserMintedNFT(userId) {
  try {
    const nft = await prisma.nFT.findFirst({
      where: {
        userId,
        isMinted: true
      }
    });

    return !!nft;
  } catch (error) {
    console.error('Error checking if user has minted NFT:', error);
    throw new Error('Failed to check NFT minting status');
  }
}

// Mint ERC-721 member card
async function mintMemberCard(user, walletAddress, contractAddress, deployerPrivateKey) {
  try {
    // Check if user already has a minted NFT
    const hasMinted = await hasUserMintedNFT(user.id);
    if (hasMinted) {
      throw new Error('User already has a minted member card');
    }

    // Generate token ID (you might want to use a more sophisticated method)
    const tokenId = Date.now().toString();

    // Generate metadata
    const metadata = generateNFTMetadata(user, tokenId);

    // Upload metadata to IPFS
    const ipfsHash = await uploadMetadataToIPFS(metadata);
    metadata.ipfsHash = ipfsHash;

    // Store NFT in database
    const nft = await storeNFT(user.id, tokenId, metadata, contractAddress);

    // For development, skip actual blockchain minting if no contract address
    if (!contractAddress || !deployerPrivateKey) {
      console.log('Skipping blockchain minting - using development mode');
      // Update NFT as minted for development
      await updateNFTMintingStatus(tokenId, 'mock-tx-hash', 0);
      
      return {
        nft,
        transactionHash: 'mock-tx-hash',
        blockNumber: 0
      };
    }

    // Mint NFT on blockchain
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(deployerPrivateKey, provider);

    // Load contract ABI (using the actual contract functions)
    const contractABI = [
      "function mintNFT(address to, string memory metadataURI) public returns (uint256)",
      "function tokenURI(uint256 tokenId) public view returns (string memory)",
      "function totalSupply() public view returns (uint256)",
      "function owner() public view returns (address)"
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Mint the NFT using the correct function name
    const tokenURI = `ipfs://${ipfsHash}`;
    console.log(`Minting NFT for user ${user.id} to address ${walletAddress}`);
    console.log(`Token URI: ${tokenURI}`);
    
    const tx = await contract.mintNFT(walletAddress, tokenURI);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

    // Update NFT minting status
    await updateNFTMintingStatus(tokenId, receipt.hash, receipt.blockNumber);

    return {
      nft,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error minting member card:', error);
    throw error;
  }
}

// Get user's NFT collection
async function getUserNFTCollection(userId) {
  try {
    const nfts = await prisma.nFT.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return nfts;
  } catch (error) {
    console.error('Error getting user NFT collection:', error);
    throw new Error('Failed to get NFT collection');
  }
}

// Verify NFT ownership
async function verifyNFTOwnership(userId, tokenId) {
  try {
    const nft = await prisma.nFT.findFirst({
      where: {
        userId,
        tokenId,
        isMinted: true
      }
    });

    return !!nft;
  } catch (error) {
    console.error('Error verifying NFT ownership:', error);
    throw new Error('Failed to verify NFT ownership');
  }
}

module.exports = {
  uploadMetadataToIPFS,
  generateNFTMetadata,
  storeNFT,
  updateNFTMintingStatus,
  getNFTsByUserId,
  getNFTByTokenId,
  hasUserMintedNFT,
  mintMemberCard,
  getUserNFTCollection,
  verifyNFTOwnership
};
