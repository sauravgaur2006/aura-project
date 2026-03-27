import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// #4: Zod schemas for input validation
const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});

// #3: Helper to set JWT as httpOnly cookie
const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    // CRITICAL: Must be true for sameSite: 'none' to work
    secure: true, 
    // CRITICAL: 'none' allows cookies to work across Vercel and Render domains
    sameSite: isProduction ? 'none' : 'lax', 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  return token;
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    setTokenCookie(res, user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak } });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    setTokenCookie(res, user._id);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    setTokenCookie(res, user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};

// Session verification — called by frontend on load to check if cookie is still valid
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak } });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};