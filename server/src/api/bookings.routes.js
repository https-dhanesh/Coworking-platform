import express from 'express';
import { createBooking, getUserBookings, getOwnerBookings, verifyPayment } from '../controllers/bookings.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/owner-history', authMiddleware, getOwnerBookings);
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;