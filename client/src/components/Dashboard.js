import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  WalletIcon, 
  RectangleStackIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, wallet, nfts, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'wallet', name: 'Wallet', icon: WalletIcon },
    { id: 'nfts', name: 'NFTs', icon: RectangleStackIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CubeIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">ChainClub</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName || user.email}!
          </h2>
          <p className="text-gray-300">Manage your Web3 membership and NFTs</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-300">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Member Since</h4>
                  <p className="text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Status</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Your Wallet</h3>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Connected</span>
                </div>
              </div>

              {wallet ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Wallet Address</h4>
                    <p className="text-gray-300 font-mono text-sm break-all">
                      {wallet.address}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">Balance</h4>
                      <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-400">
                      {parseFloat(wallet.balance || 0).toFixed(4)} ETH
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No wallet found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nfts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Your NFTs</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  <span>Mint NFT</span>
                </button>
              </div>

              {nfts && nfts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft) => (
                    <div key={nft.id} className="bg-white/5 rounded-lg p-4">
                      <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                        <RectangleStackIcon className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="text-white font-medium mb-2">{nft.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">{nft.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Token ID: {nft.tokenId}</span>
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
                <div className="text-center py-8">
                  <RectangleStackIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">No NFTs found</p>
                  <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                    Mint Your First NFT
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Settings</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Account Settings</h4>
                  <p className="text-gray-300 text-sm">Manage your account preferences and security settings.</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Privacy</h4>
                  <p className="text-gray-300 text-sm">Control your privacy and data sharing preferences.</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Notifications</h4>
                  <p className="text-gray-300 text-sm">Configure your notification preferences.</p>
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
