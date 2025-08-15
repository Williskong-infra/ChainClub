import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Fetch fresh user data
        fetchUserProfile();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const { user: userData, wallet: walletData, nfts: nftsData } = response.data.data;
      
      setUser(userData);
      setWallet(walletData);
      setNfts(nftsData || []);
      
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      const { user: newUser, wallet: newWallet, nft: newNft, token } = response.data.data;
      
      setUser(newUser);
      setWallet(newWallet);
      setNfts([newNft]);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Registration successful! Welcome to ChainClub!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { user: userData, wallet: walletData, nfts: nftsData, token } = response.data.data;
      
      setUser(userData);
      setWallet(walletData);
      setNfts(nftsData || []);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setWallet(null);
      setNfts([]);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserProfile();
    }
  };

  const value = {
    user,
    wallet,
    nfts,
    loading,
    register,
    login,
    logout,
    updateProfile,
    refreshUserData,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
