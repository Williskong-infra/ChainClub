const { ethers } = require('ethers');
const crypto = require('crypto');
const { prisma } = require('../config/database');

// Encryption/Decryption functions
function encryptPrivateKey(privateKey, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32)), iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptPrivateKey(encryptedPrivateKey, encryptionKey) {
  const parts = encryptedPrivateKey.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32)), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Generate a new Ethereum wallet
async function generateWallet() {
  try {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  } catch (error) {
    console.error('Error generating wallet:', error);
    throw new Error('Failed to generate wallet');
  }
}

// Store wallet information in database
async function storeWallet(userId, walletData, encryptionKey) {
  try {
    const encryptedPrivateKey = encryptPrivateKey(walletData.privateKey, encryptionKey);
    
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        address: walletData.address,
        encryptedPrivateKey,
        balance: '0'
      }
    });

    return wallet;
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw new Error('Failed to store wallet');
  }
}

// Get wallet by user ID
async function getWalletByUserId(userId) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });
    return wallet;
  } catch (error) {
    console.error('Error getting wallet:', error);
    throw new Error('Failed to get wallet');
  }
}

// Get wallet by address
async function getWalletByAddress(address) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address }
    });
    return wallet;
  } catch (error) {
    console.error('Error getting wallet by address:', error);
    throw new Error('Failed to get wallet by address');
  }
}

// Update wallet balance
async function updateWalletBalance(userId, balance) {
  try {
    const wallet = await prisma.wallet.update({
      where: { userId },
      data: { balance }
    });
    return wallet;
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw new Error('Failed to update wallet balance');
  }
}

// Get wallet balance from blockchain
async function getWalletBalance(address, rpcUrl) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw new Error('Failed to get wallet balance');
  }
}

// Get wallet address
async function getWalletAddress(userId) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { address: true }
    });
    return wallet?.address;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw new Error('Failed to get wallet address');
  }
}

// Create a new wallet for a user
async function createWalletForUser(userId, encryptionKey) {
  try {
    // Check if user already has a wallet
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (existingWallet) {
      throw new Error('User already has a wallet');
    }

    // Generate new wallet
    const walletData = await generateWallet();
    
    // Store wallet in database
    const wallet = await storeWallet(userId, walletData, encryptionKey);
    
    return {
      address: wallet.address,
      balance: wallet.balance
    };
  } catch (error) {
    console.error('Error creating wallet for user:', error);
    throw error;
  }
}

module.exports = {
  generateWallet,
  storeWallet,
  getWalletByUserId,
  getWalletByAddress,
  updateWalletBalance,
  getWalletBalance,
  getWalletAddress,
  createWalletForUser,
  encryptPrivateKey,
  decryptPrivateKey
};
