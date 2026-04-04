import express from 'express';
import multer from 'multer';
import { exportProducts, importProducts } from '../controllers/csvController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/export').get(protect, admin, exportProducts);
router.route('/import').post(protect, admin, upload.single('file'), importProducts);

export default router;
