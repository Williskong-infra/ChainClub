import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Wallet API
export const walletAPI = {
  getInfo: () => api.get('/wallet/info'),
  getBalance: () => api.get('/wallet/balance'),
  getAddress: () => api.get('/wallet/address'),
  create: () => api.post('/wallet/create'),
};

// NFT API
export const nftAPI = {
  getTokens: () => api.get('/nft/tokens'),
  mint: () => api.post('/nft/mint'),
  getToken: (tokenId, contractAddress) => 
    api.get(`/nft/${tokenId}?contract=${contractAddress}`),
  verifyOwnership: (tokenId, contractAddress) => 
    api.get(`/nft/verify/${tokenId}?contract=${contractAddress}`),
  getContractInfo: (contractAddress) => 
    api.get(`/nft/contract/info?contract=${contractAddress}`),
};

export default api;
