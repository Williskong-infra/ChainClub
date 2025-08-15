const crypto = require('crypto');

console.log('🔐 Generating Secure Keys for ChainClub\n');

// Generate JWT Secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('');

// Generate Encryption Key (32 characters for AES-256-CBC)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY:');
console.log(encryptionKey);
console.log('');

// Generate additional security keys
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET (optional):');
console.log(sessionSecret);
console.log('');

console.log('📝 Instructions:');
console.log('1. Copy these values to your server/.env file');
console.log('2. Keep these keys secure and never share them');
console.log('3. Use different keys for production environments');
console.log('4. Store production keys in environment variables, not in code');
console.log('');

console.log('🔒 Security Tips:');
console.log('- Use at least 32 characters for encryption keys');
console.log('- Use at least 64 characters for JWT secrets');
console.log('- Rotate keys periodically in production');
console.log('- Never commit .env files to version control');
console.log('- Use different keys for development, staging, and production');
