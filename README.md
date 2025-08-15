# ChainClub - Web3 Membership Platform

A modern Web3 membership platform built with React, Node.js, and Ethereum blockchain integration. Users can register, get automatic Ethereum wallets, and receive exclusive NFT member cards.

## 🚀 Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens
- **Automatic Wallet Creation**: Ethereum wallets are automatically generated for new users
- **NFT Member Cards**: ERC-721 tokens minted to user wallets upon registration
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Blockchain Integration**: Full Ethereum (Sepolia testnet) integration
- **IPFS Storage**: NFT metadata stored on decentralized IPFS
- **Prisma ORM**: Type-safe database operations with Prisma

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Toast notifications
- **React Query** - Server state management
- **Ethers.js** - Ethereum blockchain interaction

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Type-safe database client
- **MySQL** - Database (hosted on db.fun-verse.io)
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Ethers.js** - Ethereum wallet generation
- **IPFS** - Decentralized file storage
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation

### Blockchain
- **Ethereum Sepolia Testnet** - Development blockchain
- **ERC-721** - NFT standard
- **Hardhat** - Development environment
- **OpenZeppelin Contracts** - Secure smart contracts

## 📁 Project Structure

```
ChainClub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── prisma/            # Prisma schema and migrations
│   ├── scripts/           # Setup scripts
│   └── index.js          # Server entry point
├── contracts/             # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.js # Hardhat configuration
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL database access
- Ethereum wallet with Sepolia testnet ETH

### 1. Clone and Install

```bash
git clone <repository-url>
cd ChainClub
npm run install-all
```

### 2. Environment Setup

#### Backend Environment
Copy `server/env.example` to `server/.env` and configure:

```env
# Database Configuration (Prisma)
DATABASE_URL="mysql://root:3nqnHm2tfo2kKZQluHnz@db.fun-verse.io:3306/ChainClub"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Encryption Key (32 characters for AES-256-CBC)
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Ethereum Configuration
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here

# NFT Contract Configuration
NFT_CONTRACT_ADDRESS=your_deployed_nft_contract_address

# IPFS Configuration
IPFS_URL=https://ipfs.infura.io:5001/api/v0
IPFS_PROJECT_ID=your_ipfs_project_id
IPFS_PROJECT_SECRET=your_ipfs_project_secret

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

#### Frontend Environment
Copy `client/env.example` to `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CHAIN_ID=11155111
REACT_APP_CONTRACT_ADDRESS=your_nft_contract_address
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

### 3. Database Setup

```bash
cd server
npm run setup
```

This will:
- Generate Prisma client
- Push schema to database
- Create initial migration

### 4. Smart Contract Deployment

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Start Development Servers

```bash
# From root directory
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Wallet
- `GET /api/wallet/info` - Get wallet information
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/address` - Get wallet address
- `POST /api/wallet/create` - Create new wallet

### NFT
- `GET /api/nft/my-nfts` - Get user's NFTs
- `GET /api/nft/collection` - Get NFT collection with details
- `POST /api/nft/mint-member-card` - Mint member card NFT
- `GET /api/nft/:tokenId` - Get specific NFT
- `GET /api/nft/:tokenId/verify` - Verify NFT ownership

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - API request throttling
- **Input Validation** - Express-validator for all inputs
- **Private Key Encryption** - AES-256-CBC encryption for wallet private keys
- **CORS Protection** - Configured CORS policies
- **Helmet Security** - Security headers middleware

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching capability
- **Smooth Animations** - Framer Motion transitions
- **Toast Notifications** - User feedback system
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Graceful error displays
- **Glass Morphism** - Modern glass effect design

## 🔄 User Flow

1. **Registration**: User provides email and password
2. **Wallet Creation**: System automatically generates Ethereum wallet
3. **NFT Minting**: Member card NFT is minted to user's wallet
4. **Login**: User can log in with credentials
5. **Dashboard**: View wallet balance, NFT collection, and profile
6. **Profile Management**: Update personal information and settings

## 🛠️ Development

### Prisma Commands
```bash
cd server
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create and apply migrations
npm run prisma:studio      # Open Prisma Studio
npm run db:push           # Push schema changes
```

### Smart Contract Development
```bash
cd contracts
npx hardhat compile       # Compile contracts
npx hardhat test          # Run tests
npx hardhat node          # Start local blockchain
```

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Run database migrations: `npm run prisma:migrate`
3. Build and start server: `npm start`

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to hosting service (Vercel, Netlify, etc.)

### Smart Contract Deployment
1. Configure production network in Hardhat
2. Deploy contracts: `npx hardhat run scripts/deploy.js --network mainnet`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Note**: This is a development version using Sepolia testnet. For production, ensure proper security measures and mainnet deployment.
