const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  validateResetToken,
  resetPassword
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);

module.exports = router;