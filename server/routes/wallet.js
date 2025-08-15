const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const walletService = require('../services/walletService');

const router = express.Router();

// Get wallet info for authenticated user
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const wallet = await walletService.getWalletByUserId(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get current balance from blockchain
    const balance = await walletService.getWalletBalance(
      wallet.address, 
      process.env.ETHEREUM_RPC_URL
    );

    // Update balance in database
    await walletService.updateWalletBalance(userId, balance);

    res.json({
      success: true,
      data: {
        address: wallet.address,
        balance: balance,
        createdAt: wallet.createdAt
      }
    });
  } catch (error) {
    console.error('Get wallet info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet information'
    });
  }
});

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const wallet = await walletService.getWalletByUserId(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    const balance = await walletService.getWalletBalance(
      wallet.address, 
      process.env.ETHEREUM_RPC_URL
    );

    res.json({
      success: true,
      data: {
        address: wallet.address,
        balance: balance
      }
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance'
    });
  }
});

// Get wallet address
router.get('/address', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const address = await walletService.getWalletAddress(userId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      data: {
        address: address
      }
    });
  } catch (error) {
    console.error('Get wallet address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet address'
    });
  }
});

// Create new wallet (if user doesn't have one)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user already has a wallet
    const existingWallet = await walletService.getWalletByUserId(userId);
    
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'User already has a wallet'
      });
    }

    // Create new wallet
    const wallet = await walletService.createWalletForUser(
      userId, 
      process.env.ENCRYPTION_KEY
    );

    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      data: {
        address: wallet.address,
        balance: wallet.balance
      }
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create wallet'
    });
  }
});

module.exports = router;
