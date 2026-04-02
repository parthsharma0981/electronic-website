import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getTopSellers,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly, adminOrSeller } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/top-sellers', getTopSellers);   // ← before /:id
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOrSeller, createProduct);
router.put('/:id', protect, adminOrSeller, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:id/image/:publicId', protect, adminOnly, deleteProductImage);

export default router;