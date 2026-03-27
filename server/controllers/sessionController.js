import { z } from 'zod';
import Session from '../models/Session.js';
import User from '../models/User.js';

// #4: Zod schema for endSession input validation
const endSessionSchema = z.object({
  sessionId: z.string().min(1).max(100),
  focusScoreAvg: z.number().min(0).max(100),
  events: z.array(z.any()).optional().default([]),
});

export const startSession = async (req, res) => {
  try {
    const session = new Session({ userId: req.user.id });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    // #7: Sanitize error messages
    console.error('Start session error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const endSession = async (req, res) => {
  try {
    // #4: Validate input
    const { sessionId, focusScoreAvg, events } = endSessionSchema.parse(req.body);

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // #5: IDOR fix — verify the session belongs to the authenticated user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    session.endTime = Date.now();
    session.focusScoreAvg = focusScoreAvg;
    session.events = events;
    await session.save();

    // Update user points and streak
    const user = await User.findById(req.user.id);
    const durationMinutes = (session.endTime - session.startTime) / (1000 * 60);
    const pointsEarned = Math.floor((durationMinutes * focusScoreAvg) / 10);

    user.points += pointsEarned;

    // Simple streak logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastSession = user.lastSessionDate ? new Date(user.lastSessionDate).setHours(0, 0, 0, 0) : null;

    if (!lastSession || today > lastSession) {
      if (lastSession && today - lastSession <= 86400000 * 1.5) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastSessionDate = Date.now();
    }

    await user.save();

    res.json({ session, pointsEarned, totalPoints: user.points, streak: user.streak });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    // #7: Sanitize error messages
    console.error('End session error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ startTime: -1 }).limit(10);
    res.json(sessions);
  } catch (error) {
    // #7: Sanitize error messages
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};
