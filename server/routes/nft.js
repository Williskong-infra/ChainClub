const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const nftService = require('../services/nftService');
const { prisma } = require('../config/database');
const walletService = require('../services/walletService');

const router = express.Router();

// Get user's NFTs
router.get('/my-nfts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const nfts = await nftService.getNFTsByUserId(userId);
    
    res.json({
      success: true,
      data: nfts
    });
  } catch (error) {
    console.error('Get user NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user NFTs'
    });
  }
});

// Get user's NFT collection with user details
router.get('/collection', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const nfts = await nftService.getUserNFTCollection(userId);
    
    res.json({
      success: true,
      data: nfts
    });
  } catch (error) {
    console.error('Get NFT collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT collection'
    });
  }
});

// Mint member card NFT
router.post('/mint-member-card', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's wallet
    const wallet = await walletService.getWalletByUserId(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check if user already has a minted NFT
    const hasMinted = await nftService.hasUserMintedNFT(userId);
    
    if (hasMinted) {
      return res.status(400).json({
        success: false,
        message: 'User already has a minted member card'
      });
    }

    // Mint the NFT
    const result = await nftService.mintMemberCard(
      user,
      wallet.address,
      process.env.NFT_CONTRACT_ADDRESS,
      process.env.DEPLOYER_PRIVATE_KEY
    );

    res.status(201).json({
      success: true,
      message: 'Member card minted successfully',
      data: {
        nft: result.nft,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      }
    });
  } catch (error) {
    console.error('Mint member card error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mint member card'
    });
  }
});

// Get specific NFT by token ID
router.get('/:tokenId', authenticateToken, async (req, res) => {
  try {
    const { tokenId } = req.params;
    const userId = req.user.userId;
    
    const nft = await nftService.getNFTByTokenId(tokenId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    // Check if user owns this NFT
    const isOwner = await nftService.verifyNFTOwnership(userId, tokenId);
    
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Get NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT'
    });
  }
});

// Verify NFT ownership
router.get('/:tokenId/verify', authenticateToken, async (req, res) => {
  try {
    const { tokenId } = req.params;
    const userId = req.user.userId;
    
    const isOwner = await nftService.verifyNFTOwnership(userId, tokenId);
    
    res.json({
      success: true,
      data: {
        tokenId,
        isOwner
      }
    });
  } catch (error) {
    console.error('Verify NFT ownership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify NFT ownership'
    });
  }
});

module.exports = router;
