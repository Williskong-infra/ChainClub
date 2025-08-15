#!/bin/bash

# ChainClub Setup Script
# This script will set up the entire ChainClub project

set -e

echo "🚀 Welcome to ChainClub Setup!"
echo "This script will set up your ChainClub Web3 membership platform"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if MySQL is installed
check_mysql() {
    print_status "Checking MySQL installation..."
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL is not installed. Please install MySQL 8.0+ manually."
        print_warning "You can download it from: https://dev.mysql.com/downloads/mysql/"
        read -p "Press Enter to continue without MySQL (you'll need to set it up later)..."
    else
        print_success "MySQL is installed"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    # Install contract dependencies
    print_status "Installing contract dependencies..."
    cd contracts
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Server environment
    if [ ! -f "server/.env" ]; then
        cp server/env.example server/.env
        print_success "Created server/.env (please configure it)"
    else
        print_warning "server/.env already exists"
    fi
    
    # Client environment
    if [ ! -f "client/.env" ]; then
        cp client/env.example client/.env
        print_success "Created client/.env (please configure it)"
    else
        print_warning "client/.env already exists"
    fi
    
    # Contract environment
    if [ ! -f "contracts/.env" ]; then
        cp contracts/env.example contracts/.env
        print_success "Created contracts/.env (please configure it)"
    else
        print_warning "contracts/.env already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if command -v mysql &> /dev/null; then
        read -p "Do you want to set up the MySQL database now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter MySQL root password: " MYSQL_PASSWORD
            read -p "Enter database name (default: chainclub): " DB_NAME
            DB_NAME=${DB_NAME:-chainclub}
            
            # Create database and tables
            mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
            mysql -u root -p"$MYSQL_PASSWORD" "$DB_NAME" < server/database/schema.sql
            
            print_success "Database setup completed"
        fi
    else
        print_warning "MySQL not found. Please set up the database manually using server/database/schema.sql"
    fi
}

# Compile contracts
compile_contracts() {
    print_status "Compiling smart contracts..."
    cd contracts
    npm run compile
    cd ..
    print_success "Smart contracts compiled successfully"
}

# Build client
build_client() {
    print_status "Building React client..."
    cd client
    npm run build
    cd ..
    print_success "React client built successfully"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Configure environment files:"
    echo "   - server/.env"
    echo "   - client/.env"
    echo "   - contracts/.env"
    echo ""
    echo "2. Set up your database:"
    echo "   - Create MySQL database 'chainclub'"
    echo "   - Run: mysql -u root -p chainclub < server/database/schema.sql"
    echo ""
    echo "3. Deploy smart contracts:"
    echo "   - Configure contracts/.env with your private key and RPC URL"
    echo "   - Run: cd contracts && npm run deploy:sepolia"
    echo ""
    echo "4. Start the application:"
    echo "   - Development: npm run dev"
    echo "   - Production: npm run build && npm start"
    echo ""
    echo "5. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo ""
    echo "📚 Documentation: README.md"
    echo ""
}

# Main setup function
main() {
    echo "Starting ChainClub setup..."
    echo ""
    
    check_nodejs
    check_mysql
    install_dependencies
    setup_environment
    setup_database
    compile_contracts
    build_client
    show_next_steps
}

# Run main function
main "$@"
