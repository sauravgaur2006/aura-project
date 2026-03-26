import express from 'express';
import { startSession, endSession, getSessions } from '../controllers/sessionController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', auth, startSession);
router.post('/end', auth, endSession);
router.get('/', auth, getSessions);

export default router;
