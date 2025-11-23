import express from 'express'
import { getAllAmenities , getAmenitiesForSpace} from '../controllers/amenities.controller.js'

const router = express.Router();

router.get('/',getAllAmenities)
router.get('/for-space/:spaceId',getAmenitiesForSpace);

export default router;