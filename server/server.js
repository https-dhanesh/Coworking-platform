import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './src/api/auth.routes.js';
import spaceRoutes from './src/api/spaces.routes.js'
import amenitiesRoutes from './src/api/amenities.routes.js'
import bookingsRoutes from './src/api/bookings.routes.js';
import reviewsRoutes from './src/api/reviews.routes.js';

import cors from 'cors'

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL 
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); 
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});