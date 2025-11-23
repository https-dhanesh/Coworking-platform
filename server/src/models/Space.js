import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  price_per_day: {
    type: Number,
    required: true
  },
  image_url: {
    type: String,
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  total_slots: {
    type: Number,
    required: true,
    default: 10
  },
});

spaceSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'space_id',
  justOne: false
});

spaceSchema.set('toObject', { virtuals: true });
spaceSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Space', spaceSchema);