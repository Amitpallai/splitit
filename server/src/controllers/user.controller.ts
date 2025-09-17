import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { profileUpdateSchema } from '../utils/validator';

 
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId; // typed from auth middleware

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Profile fetched successfully', user });
  } catch (err: any) {
    next(err);
  }
};
 
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validation = profileUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { name, appearance } = validation.data;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (appearance) updateData.appearance = appearance;

    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (err: any) {
    next(err);
  }
};
