import pool from '../config/db.config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await AuthService.registerUser(username,email,password);
        return res.status(201).json(new ApiResponse(201,newUser,"User registered Successfully"));   
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Username or email already exists.' });
        }
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req,res) =>{
    const {email, password} = req.body;

    try{
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1",[email]);

        if(userResult.rows.length === 0){
            return res.status(400).json({error: 'Invalid email or password. '});
        }
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(400).json({error: 'Invalid email or password. '});
        }

        //JWT Payload 
        const payload ={
            id: user.id,
            role : user.role,
        };

        //Sign the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}