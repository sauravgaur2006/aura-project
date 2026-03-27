import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, googleLogin, logout } from '../controllers/authController.js';

const router = express.Router();

// #8: Rate limit auth endpoints — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google-login', authLimiter, googleLogin);
router.post('/logout', logout);

export default router;
