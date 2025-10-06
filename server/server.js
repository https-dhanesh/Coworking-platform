import express from 'express';
import authRoutes from './src/api/auth.routes.js';
import spaceRoutes from './src/api/spaces.routes.js'
import amenitiesRoutes from './src/api/amenities.routes.js'
import cors from 'cors'

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL 
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/spaces',spaceRoutes);
app.use('/api/amenities',amenitiesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
