import express from 'express';
import {
  registerUser,
  verifyEmailAndRegister,
  resendRegistrationOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateCart,
  updateWishlist,
} from '../controllers/authController.js';
import { registerDirect } from '../controllers/authDirectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',            registerUser);           // Step 1: send OTP
router.post('/verify-register',     verifyEmailAndRegister); // Step 2: verify OTP → save to DB
router.post('/resend-register-otp', resendRegistrationOTP);  // Resend OTP
router.post('/register-direct',     registerDirect);         // Direct register (no OTP)
router.post('/login',               loginUser);
router.post('/forgot-password',     forgotPassword);
router.post('/reset-password',      resetPassword);
router.get('/profile',              protect, getUserProfile);
router.put('/profile',              protect, updateUserProfile);
router.put('/cart',                 protect, updateCart);
router.put('/wishlist',             protect, updateWishlist);

export default router;