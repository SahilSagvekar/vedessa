const express = require('express');
const router = express.Router();
const {
  firebaseAuth,
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
const upload = require('../middleware/upload');

// Public routes
// Customers: Google / phone OTP via Firebase
router.post('/firebase', firebaseAuth);

// Staff (ADMIN / VENDOR): email + password
router.post('/login', login);
router.post('/logout', logout);

// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.put('/password', auth, changePassword);

module.exports = router;