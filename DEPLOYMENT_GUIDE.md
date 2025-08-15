# 🚀 ChainClub Polygon Amoy Deployment Guide

## 📋 Overview

This guide will help you deploy the ChainClub NFT contract to Polygon Amoy testnet and get your `NFT_CONTRACT_ADDRESS`.

**📢 IMPORTANT: Polygon Mumbai is deprecated (April 13th, 2024). Amoy is the new recommended testnet.**

## 🔧 Prerequisites

1. **MetaMask Wallet** installed
2. **Node.js & npm** installed
3. **Test MATIC** tokens (free from faucet)

## 🎯 Step-by-Step Deployment

### Step 1: Setup MetaMask for Polygon Amoy

1. **Add Amoy Network to MetaMask:**
   - Open MetaMask
   - Click Network dropdown
   - Select "Add Network"
   - Enter these details:
     - **Network Name**: Polygon Amoy Testnet
     - **RPC URL**: `https://rpc-amoy.polygon.technology`
     - **Chain ID**: `80002`
     - **Currency Symbol**: `MATIC`
     - **Block Explorer**: `https://www.oklink.com/amoy`

2. **Switch to Amoy Network**

### Step 2: Get Test MATIC

1. **Visit Polygon Faucet:**
   - Go to: https://faucet.polygon.technology/
   - Select "Amoy" network
   - Enter your wallet address
   - Request test MATIC

2. **Alternative Faucet:**
   - Visit: https://amoy-faucet.pk910.de/
   - Connect your wallet
   - Request test MATIC

### Step 3: Setup Blockchain Environment

1. **Navigate to blockchain directory:**
   ```bash
   cd blockchain-setup
   ```

2. **Run setup script:**
   ```bash
   node setup.js
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment:**
   - Edit `.env` file
   - Add your MetaMask private key
   - Add OKLink API key (optional)

### Step 4: Deploy NFT Contract

1. **Compile contracts:**
   ```bash
   npm run compile
   ```

2. **Deploy to Amoy:**
   ```bash
   npm run deploy
   ```

3. **Save the contract address** from the deployment output

### Step 5: Verify Contract (Optional)

1. **Get OKLink API Key:**
   - Visit: https://www.oklink.com/developers
   - Create free account
   - Get API key

2. **Verify contract:**
   ```bash
   npx hardhat verify --network amoy CONTRACT_ADDRESS "ChainClub Membership" "CCM" "https://ipfs.io/ipfs/"
   ```

### Step 6: Update Server Configuration

1. **Update server/.env:**
   ```env
   # Ethereum Configuration (Polygon Amoy Testnet)
   ETHEREUM_RPC_URL=https://rpc-amoy.polygon.technology
   DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here
   NFT_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

2. **Restart your server**

## 🔐 Security Keys Generation

### Generate JWT_SECRET and ENCRYPTION_KEY:

1. **Run the key generator:**
   ```bash
   node generate-keys.js
   ```

2. **Copy the generated keys to server/.env**

## 🧪 Testing Your Deployment

### Test NFT Minting:

1. **Register a new user** in your app
2. **Check the dashboard** for NFT creation
3. **Verify on Amoy Explorer** that the NFT was minted

### Test Contract Functions:

1. **View contract on Amoy Explorer:**
   - Visit: https://www.oklink.com/amoy
   - Paste your contract address
   - Check contract details

2. **Test functions:**
   - `name()` - Should return "ChainClub Membership"
   - `symbol()` - Should return "CCM"
   - `totalSupply()` - Should show number of minted NFTs

## 📊 Contract Information

### Contract Details:
- **Name**: ChainClub Membership
- **Symbol**: CCM
- **Max Supply**: 10,000 NFTs
- **Minting Fee**: 0.01 MATIC
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002

### Contract Functions:
- `mintNFT(address to, string tokenURI)` - Owner only minting
- `publicMint(string tokenURI)` - Public minting with fee
- `setMintingFee(uint256 newFee)` - Update minting fee
- `withdraw()` - Withdraw contract balance

## 🔗 Useful Links

- **Amoy Explorer**: https://www.oklink.com/amoy
- **Polygon Faucet**: https://faucet.polygon.technology/
- **Alternative Faucet**: https://amoy-faucet.pk910.de/
- **OKLink API**: https://www.oklink.com/developers

## ⚠️ Security Notes

- **Never share your private keys**
- **Use environment variables** for secrets
- **Test thoroughly** on Amoy before mainnet
- **Keep deployment scripts secure**
- **Use different keys** for development and production

## 🎉 Success Checklist

- [ ] MetaMask configured for Amoy
- [ ] Test MATIC received
- [ ] Contract deployed successfully
- [ ] Contract address saved
- [ ] Server environment updated
- [ ] NFT minting tested
- [ ] Contract verified on Amoy Explorer

## 🆘 Troubleshooting

### Common Issues:

1. **"Insufficient funds"**
   - Get more test MATIC from faucet

2. **"Network not found"**
   - Double-check Amoy network configuration in MetaMask
   - Ensure Chain ID is 80002 (not 80001)

3. **"Contract deployment failed"**
   - Check your private key in .env file
   - Ensure you have enough test MATIC

4. **"Verification failed"**
   - Wait a few minutes after deployment
   - Check constructor parameters match

### Need Help?

- Check the blockchain-setup/README.md for detailed instructions
- Verify all environment variables are set correctly
- Ensure you're connected to Amoy network in MetaMask

## 📢 Migration from Mumbai

If you were previously using Mumbai testnet:

1. **Update MetaMask** to use Amoy network
2. **Get new test MATIC** from Amoy faucet
3. **Redeploy contracts** to Amoy
4. **Update environment variables** with new contract addresses
5. **Test thoroughly** on Amoy before mainnet
