# 🚀 Polygon Amoy Testnet Setup Guide

## 📋 Prerequisites

1. **MetaMask Wallet** - Install and set up MetaMask
2. **Polygon Amoy Testnet** - Add to MetaMask
3. **Test MATIC** - Get free test tokens
4. **Node.js & npm** - For development tools

## 🔧 Step 1: Add Polygon Amoy to MetaMask

### Network Details:
- **Network Name**: Polygon Amoy Testnet
- **RPC URL**: `https://rpc-amoy.polygon.technology`
- **Chain ID**: `80002`
- **Currency Symbol**: `MATIC`
- **Block Explorer**: `https://www.oklink.com/amoy`

### How to Add:
1. Open MetaMask
2. Click Network dropdown
3. Select "Add Network"
4. Enter the details above
5. Save and switch to Amoy

## 💰 Step 2: Get Test MATIC

### Option 1: Polygon Faucet
- Visit: https://faucet.polygon.technology/
- Select "Amoy" network
- Enter your wallet address
- Request test MATIC

### Option 2: Alternative Faucet
- Visit: https://amoy-faucet.pk910.de/
- Connect your wallet
- Request test MATIC

## 🏗️ Step 3: Deploy NFT Contract

### 1. Install Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 2. Initialize Hardhat
```bash
npx hardhat init
```

### 3. Configure Hardhat
Update `hardhat.config.js` with Amoy network

### 4. Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network amoy
```

## 📝 Step 4: Update Environment Variables

After deployment, update your `server/.env`:

```env
# Ethereum Configuration (Polygon Amoy)
ETHEREUM_RPC_URL=https://rpc-amoy.polygon.technology
DEPLOYER_PRIVATE_KEY=your_private_key_here
NFT_CONTRACT_ADDRESS=your_deployed_contract_address
```

## 🔍 Step 5: Verify Contract

1. Copy your contract address
2. Visit: https://www.oklink.com/amoy
3. Paste the address
4. Verify and publish source code

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Amoy
npx hardhat run scripts/deploy.js --network amoy

# Verify contract
npx hardhat verify --network amoy CONTRACT_ADDRESS
```

## 🔐 Security Notes

- Never share your private keys
- Use environment variables for secrets
- Test thoroughly on Amoy before mainnet
- Keep your deployment scripts secure

## 📢 Important Note

**Polygon Mumbai testnet is being deprecated on April 13th, 2024.**
Amoy is the new recommended testnet for Polygon development.
