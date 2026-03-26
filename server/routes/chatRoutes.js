import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', auth, getChatHistory);
router.post('/', auth, sendMessage);

export default router;
