import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  space_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  booked_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Booking', bookingSchema);