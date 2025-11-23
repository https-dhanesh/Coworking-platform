import express from 'express';
import { submitReview, getReviewsBySpace } from '../controllers/reviews.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, submitReview);
router.get('/:spaceId', getReviewsBySpace);

export default router;