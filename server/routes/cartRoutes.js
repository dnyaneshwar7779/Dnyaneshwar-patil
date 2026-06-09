import express from 'express';
import { getUserCart, syncUserCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getUserCart)
  .post(protect, syncUserCart);

export default router;
