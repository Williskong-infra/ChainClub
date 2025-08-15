import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  UserIcon, 
  WalletIcon, 
  CubeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const LoginSuccess = () => {
  const { user, wallet } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Success Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircleIcon className="h-8 w-8 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to ChainClub!
            </h1>
            <p className="text-gray-300">
              You have successfully logged in to your account.
            </p>
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="space-y-4 mb-8"
          >
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <WalletIcon className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Wallet</p>
                  <p className="text-white font-medium">
                    {wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Creating...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CubeIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Membership</p>
                  <p className="text-white font-medium">ChainClub Member</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Redirect Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-300 text-sm mb-4">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <span>Go to Dashboard</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Background Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-1/4 left-1/4 h-32 w-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 h-40 w-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginSuccess;
