const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authRateLimit } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateProfileUpdate = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters')
];

// Apply rate limiting to auth routes
router.use(authRateLimit);

// POST /api/auth/register - Register new user
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout - Logout user
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/profile - Get user profile
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, authController.updateProfile);

module.exports = router;
