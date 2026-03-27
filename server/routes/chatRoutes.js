import express from 'express';
import rateLimit from 'express-rate-limit';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// #6: Rate limit Gemini AI chat endpoint — 10 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/history', auth, getChatHistory);
router.post('/', auth, chatLimiter, sendMessage);

export default router;
