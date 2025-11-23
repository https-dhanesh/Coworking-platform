import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ space_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);