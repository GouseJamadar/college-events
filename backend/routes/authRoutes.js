const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  adminLogin,
  getProfile,
  resendVerification
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.get('/profile', protect, getProfile);
router.post('/resend-verification', resendVerification);

module.exports = router;
