import express from 'express';
import {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { placeOrderDirect } from '../controllers/orderDirectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly, adminOrSeller } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/direct', protect, placeOrderDirect);
router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, adminOrSeller, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
