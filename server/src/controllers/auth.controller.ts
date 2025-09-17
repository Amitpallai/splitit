import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { signupSchema, loginSchema } from '../utils/validator';
import { AuthRequest } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// ---------------- Signup ----------------
export const signup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Send token in cookie and JSON
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email },
      token, // frontend can store in localStorage if needed
      message: 'Signed up successfully',
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Login ----------------
export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
      token,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- Check Auth ----------------
export const isAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Logout ----------------
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
