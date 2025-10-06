import pool from '../config/db.config.js';
import bcrypt from 'bcryptjs';

const registerUser = async (username,email,password)=>{
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query("INSERT INTO users (username, email,password_hash) VALUES ($1,$2,$3) RETURNING id,username,email,role", [username, email, password_hash]);
    return newUser.rows[0];
};

export const AuthService = {registerUser,};