import express from 'express'
import { getAllAmenities , addAmenitiesToSpace, getAmenitiesBySpace} from '../controllers/amenities.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/',getAllAmenities)
router.post('/add-to-space',authMiddleware,addAmenitiesToSpace);
router.get('/for-space/:spaceId',getAmenitiesBySpace);

export default router;