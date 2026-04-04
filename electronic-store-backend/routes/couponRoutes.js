import express from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  toggleCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  throw new Error('Admin access required');
};

router.post('/validate', protect, validateCoupon);
router.get('/',          protect, adminOnly, getAllCoupons);
router.post('/',         protect, adminOnly, createCoupon);
router.delete('/:id',   protect, adminOnly, deleteCoupon);
router.patch('/:id/toggle', protect, adminOnly, toggleCoupon);

export default router;
