import Booking from '../models/Booking.js';
import Space from '../models/Space.js';
import razorpayInstance from '../config/razorpay.config.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

export const createBooking = async (req, res) => {
  try {
    const { spaceId, startDate, endDate, totalPrice } = req.body;
    const user_id = req.user.id;

    const amountInPaise = Math.round(totalPrice * 100);
    const space_id_object = new mongoose.Types.ObjectId(spaceId);
    const user_id_object = new mongoose.Types.ObjectId(user_id);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: "Failed to create payment order." });
    }

    const newBooking = await Booking.create({
      space_id: space_id_object,
      user_id: user_id_object,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      total_price: totalPrice,
      status: 'pending',
      razorpay_order_id: order.id,
    });

    const space = await Space.findById(newBooking.space_id);

    res.status(201).json({
      order,
      booking: newBooking,
      ownerId: space.owner_id.toString()
    });

  } catch (err) {
    console.error('Booking Creation Error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation Failed. Please check all required fields.' });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format provided for space or user.' });
    }
    res.status(500).send("Server error: " + err.message);
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await Booking.find({ user_id: user_id })
      .sort({ start_date: -1 })
      .populate({
        path: 'space_id',
        select: 'name address price_per_day image_url'
      });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error: " + err.message);
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const owner_id = req.user.id;
    console.log(owner_id)
    const ownedSpaces = await Space.find({ owner_id: owner_id }).select('_id');
    const ownedSpaceIds = ownedSpaces.map(space => space._id);
    const bookings = await Booking.find({ space_id: { $in: ownedSpaceIds } })
      .sort({ booked_at: -1 })
      .populate({
        path: 'space_id',
        select: 'name address image_url'
      })
      .populate({
        path: 'user_id',
        select: 'username email'
      });

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error: " + err.message);
  }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const expectedSignature = shasum.digest('hex');
        if (expectedSignature === razorpay_signature) {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: 'confirmed', razorpay_payment_id },
                { new: true }
            );
            return res.json({ success: true, booking: updatedBooking });
        }
        return res.status(400).json({ success: false, error: 'Payment verification failed.' });
    } catch (err) {
        console.error("Payment Verification Error:", err.message);
        res.status(500).send("Server error: " + err.message);
    }
};