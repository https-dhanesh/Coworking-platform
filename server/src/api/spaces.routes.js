import express from 'express'
import { createSpace, deleteSpace, getAllSpaces, getMySpaces, getSpaceById, syncSpaceAmenities, updateSpace } from '../controllers/spaces.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/',authMiddleware,upload.single('image'),createSpace);
router.get('/',getAllSpaces);
router.get('/my-spaces',authMiddleware,getMySpaces);
router.get('/:id',getSpaceById);
router.put('/:id',authMiddleware,updateSpace)
router.delete('/:id',authMiddleware,deleteSpace)
router.put('/:id/amenities',authMiddleware,syncSpaceAmenities);
export default router