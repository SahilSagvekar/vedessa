const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Candidate formats a phone number may have been stored in before we
 * standardised on E.164 (e.g. vendor sign-ups typed "9876543210").
 */
const phoneVariants = (e164) => {
  const digits = e164.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  return Array.from(new Set([e164, digits, last10, `0${last10}`, `+91${last10}`]));
};

/**
 * Sign in / sign up with Google or phone OTP (Firebase Auth)
 * POST /api/auth/firebase   body: { idToken, fullName? }
 *
 * The frontend completes the Google popup or the OTP check with Firebase and
 * sends us the resulting ID token. We verify it server-side, find or create
 * the matching customer, and answer with our own JWT, so every other route
 * keeps using the same auth middleware as before.
 */
const firebaseAuth = async (req, res) => {
  try {
    const { idToken, fullName } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required'
      });
    }

    let decoded;
    try {
      const { getFirebaseAdmin } = require('../config/firebase');
      decoded = await getFirebaseAdmin().auth().verifyIdToken(idToken);
    } catch (error) {
      if (/not configured/i.test(error.message)) {
        console.error('Firebase auth error:', error.message);
        return res.status(503).json({
          success: false,
          message: 'Sign-in is temporarily unavailable'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired sign-in. Please try again.'
      });
    }

    const firebaseUid = decoded.uid;
    // Only trust an email Firebase has verified (Google always has).
    const email = decoded.email && decoded.email_verified
      ? decoded.email.toLowerCase()
      : null;
    const phone = decoded.phone_number || null; // E.164, e.g. +919876543210
    const cleanName = (fullName || decoded.name || '').toString().trim().slice(0, 100) || null;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Your sign-in did not return a verified email or phone number'
      });
    }

    const staffOnly = () => res.status(403).json({
      success: false,
      message: 'This account is a staff account. Please use the staff login.'
    });

    // 1. Returning Firebase user
    let user = await prisma.user.findUnique({ where: { firebaseUid } });
    let isNewUser = false;

    if (user && user.role !== 'CUSTOMER') return staffOnly();

    // 2. Existing customer who signed up the old way: link by verified email / phone
    if (!user && email) {
      const byEmail = await prisma.user.findUnique({ where: { email } });
      if (byEmail) {
        if (byEmail.role !== 'CUSTOMER') return staffOnly();
        user = byEmail;
      }
    }
    if (!user && phone) {
      const byPhone = await prisma.user.findFirst({
        where: { phone: { in: phoneVariants(phone) }, role: 'CUSTOMER' }
      });
      if (byPhone) user = byPhone;
    }

    if (user) {
      // Link / top up. Never overwrite details the customer already has.
      const updateData = {};
      if (user.firebaseUid !== firebaseUid) {
        // Don't steal an account already linked to a different Firebase identity.
        if (user.firebaseUid) {
          return res.status(409).json({
            success: false,
            message: 'This account is already linked to another sign-in method'
          });
        }
        updateData.firebaseUid = firebaseUid;
      }
      if (!user.email && email) updateData.email = email;
      if (!user.phone && phone) updateData.phone = phone;
      if (!user.fullName && cleanName) updateData.fullName = cleanName;
      if (!user.avatarUrl && decoded.picture) updateData.avatarUrl = decoded.picture;
      if (email && !user.emailVerified) updateData.emailVerified = true;

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({ where: { id: user.id }, data: updateData });
      }
    } else {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          emailVerified: !!email,
          phone,
          fullName: cleanName,
          avatarUrl: decoded.picture || null,
          role: 'CUSTOMER'
        }
      });
    }

    const token = generateToken(user.id);
    const safeUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: isNewUser ? 'Account created' : 'Login successful',
      data: {
        user: safeUser,
        token,
        isNewUser,
        needsName: !user.fullName
      }
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error signing in',
      error: error.message
    });
  }
};

/**
 * Staff login (ADMIN / VENDOR) with email + password
 * POST /api/auth/login
 * Customers sign in with Google or phone OTP (see firebaseAuth).
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Customers no longer use passwords
    if (user.role === 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Please sign in with Google or your mobile number'
      });
    }

    // Check password
    const isPasswordValid = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password hash)
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    // User is already attached by auth middleware
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    let { avatarUrl } = req.body;
    const updateData = {};

    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * Change password
 * PUT /api/auth/password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'This account does not use a password'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

/**
 * Logout (client-side - just remove token)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * Forgot Password - Send reset email
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist (or is a customer, who has no password), we return success
    if (!user || user.role === 'CUSTOMER' || !user.email) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send email
    const emailService = require('../services/emailService');
    const result = await emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.fullName
    );

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      // Still return success to user to prevent email enumeration
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

/**
 * Validate Reset Token
 * POST /api/auth/validate-reset-token
 */
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Reset link has expired'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'Reset link has expired. Please request a new one.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role === 'CUSTOMER') {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

module.exports = {
  firebaseAuth,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  validateResetToken,
  resetPassword
};  