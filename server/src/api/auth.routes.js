import express from 'express';
import { register , login } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register',register);
router.post('/login', login);
router.get('/profile',authMiddleware,(req,res)=>{
    res.json({
        message:'You have accessed a protected route!',
        user: req.user
    });
});

export default router;
