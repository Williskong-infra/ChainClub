const fs = require('fs');
const path = require('path');

console.log('🚀 ChainClub Blockchain Setup for Polygon Amoy\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Edit the .env file with your configuration:');
console.log('   - Add your MetaMask private key');
console.log('   - Add your OKLink API key (optional)');
console.log('');
console.log('2. Install dependencies:');
console.log('   npm install');
console.log('');
console.log('3. Compile contracts:');
console.log('   npm run compile');
console.log('');
console.log('4. Deploy to Amoy:');
console.log('   npm run deploy');
console.log('');
console.log('🔐 Security Reminders:');
console.log('- Never share your private key');
console.log('- Use a dedicated wallet for deployment');
console.log('- Keep your .env file secure');
console.log('- Test on Amoy before mainnet');
console.log('');
console.log('💰 Get Test MATIC:');
console.log('- https://faucet.polygon.technology/ (select Amoy)');
console.log('- https://amoy-faucet.pk910.de/');
console.log('');
console.log('🔗 Useful Links:');
console.log('- Amoy Explorer: https://www.oklink.com/amoy');
console.log('- Polygon Faucet: https://faucet.polygon.technology/');
console.log('- Add Amoy to MetaMask: Network > Add Network');
console.log('');
console.log('📢 IMPORTANT:');
console.log('- Polygon Mumbai is deprecated (April 13th, 2024)');
console.log('- Amoy is the new recommended testnet');
console.log('- Chain ID: 80002 (not 80001)');
