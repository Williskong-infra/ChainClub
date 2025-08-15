import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, wallet, nfts, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'profile', name: 'Profile' },
    { id: 'wallet', name: 'Wallet' },
    { id: 'nfts', name: 'NFTs' },
    { id: 'community', name: 'Community' },
    { id: 'settings', name: 'Settings' }
  ];

  // Custom button styles - Enhanced Glassmorphism Design
  const buttonStyles = {
    primary: "glass-button bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white font-bold py-4 px-10 rounded-2xl shadow-glow-purple hover:shadow-glow transform hover:scale-105 transition-all duration-300",
    secondary: "glass-button bg-gradient-to-r from-gray-100/90 to-gray-200/90 text-gray-800 font-bold py-3 px-8 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    danger: "glass-button bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white font-bold py-3 px-8 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    success: "glass-button bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white font-bold py-3 px-8 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    warning: "glass-button bg-gradient-to-r from-orange-500/90 to-yellow-500/90 text-white font-bold py-3 px-8 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    info: "glass-button bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white font-bold py-3 px-8 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    tab: "glass-button bg-gradient-to-r from-white/80 to-gray-50/80 text-gray-700 hover:text-blue-700 font-bold py-3 px-6 rounded-2xl shadow-glow transform hover:scale-105 transition-all duration-300",
    tabActive: "glass-button bg-gradient-to-r from-purple-600/95 to-purple-500/95 text-white font-bold py-3 px-6 rounded-2xl shadow-glow-purple transform scale-105 transition-all duration-300",
    small: "glass-button bg-gradient-to-r from-purple-500/90 to-purple-400/90 text-white font-bold py-2 px-6 rounded-xl shadow-glow transform hover:scale-105 transition-all duration-300 text-sm"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">ChainClub</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`${buttonStyles.danger} flex items-center gap-2`}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`${buttonStyles.danger} flex items-center gap-2 text-sm`}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName || user.email}!
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">Manage your Web3 membership and community</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Wallet Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {parseFloat(wallet?.balance || 0).toFixed(4)} ETH
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">NFTs Owned</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{nfts?.length || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">Member Level</p>
                <p className="text-lg sm:text-2xl font-bold text-white">Level 1</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center">
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">Community Points</p>
                <p className="text-lg sm:text-2xl font-bold text-white">1,250</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="hidden md:flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id ? buttonStyles.tabActive : buttonStyles.tab} flex items-center gap-2`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          {/* Mobile Tab Select */}
          <div className="md:hidden mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className={`${buttonStyles.tab} w-full text-left`}
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Dashboard Overview</h3>
                <button className={`${buttonStyles.primary} flex items-center gap-2`}>
                  <span>Mint NFT</span>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">NFT Minted</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Joined Community</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <button className={`${buttonStyles.primary} text-center`}>
                    Mint NFT
                  </button>
                  <button className={`${buttonStyles.info} text-center`}>
                    View Collection
                  </button>
                  <button className={`${buttonStyles.success} text-center`}>
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Profile Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <p className="text-gray-900">{user.firstName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <p className="text-gray-900">{user.lastName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900 break-all">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Account Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member Level</span>
                      <span className="text-sm font-medium text-gray-900">Level 1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">NFTs Owned</span>
                      <span className="text-sm font-medium text-gray-900">{nfts?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Your Wallet</h3>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>

              {wallet ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-medium">Wallet Balance</h4>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold mb-2">
                      {parseFloat(wallet.balance || 0).toFixed(4)} ETH
                    </p>
                    <p className="text-blue-100 text-sm">≈ $0.00 USD</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Wallet Address</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <p className="font-mono text-xs sm:text-sm text-gray-600 break-all">
                        {wallet.address}
                      </p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.address);
                          toast.success('Address copied!');
                        }}
                        className={`${buttonStyles.secondary} text-sm`}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No wallet found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nfts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Your NFTs</h3>
                <button className={`${buttonStyles.primary} flex items-center gap-2`}>
                  <span>Mint NFT</span>
                </button>
              </div>

              {nfts && nfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {nfts.map((nft) => (
                    <div key={nft.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="h-24 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                      </div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{nft.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{nft.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Token ID: {nft.tokenId}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          nft.isMinted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {nft.isMinted ? 'Minted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No NFTs found</p>
                  <button className={`${buttonStyles.primary} flex items-center gap-2`}>
                    Mint Your First NFT
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Community</h3>
                <div className="flex gap-4">
                  <button className={`${buttonStyles.success} text-sm`}>
                    Join Discord
                  </button>
                  <button className={`${buttonStyles.info} text-sm`}>
                    View Events
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Community Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Members</span>
                      <span className="text-sm font-medium text-gray-900">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Today</span>
                      <span className="text-sm font-medium text-gray-900">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">NFTs Minted</span>
                      <span className="text-sm font-medium text-gray-900">2,156</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Recent Members</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">Joined 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                        <p className="text-xs text-gray-500">Joined 4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Settings</h3>
                <div className="flex gap-4">
                  <button className={`${buttonStyles.secondary} text-sm`}>
                    Save Changes
                  </button>
                  <button className={`${buttonStyles.warning} text-sm`}>
                    Export Data
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Account Settings</h4>
                  <p className="text-gray-600 text-sm">Manage your account preferences and security settings.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Privacy</h4>
                  <p className="text-gray-600 text-sm">Control your privacy and data sharing preferences.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Notifications</h4>
                  <p className="text-gray-600 text-sm">Configure your notification preferences.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
