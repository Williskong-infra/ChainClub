const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up Prisma for ChainClub...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');

  // Push schema to database
  console.log('🗄️  Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully\n');

  // Optional: Create a migration
  console.log('📝 Creating initial migration...');
  try {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('✅ Initial migration created successfully\n');
  } catch (migrationError) {
    console.log('⚠️  Migration creation skipped (schema might already be up to date)\n');
  }

  console.log('🎉 Prisma setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Open Prisma Studio: npm run prisma:studio');
  console.log('3. Check the database connection');

} catch (error) {
  console.error('❌ Prisma setup failed:', error.message);
  process.exit(1);
}
