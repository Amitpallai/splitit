import { Request, Response, NextFunction } from 'express';
import Trip from '../models/Trip';
import { tripCreateSchema } from '../utils/validator';

export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = tripCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { name, participants = [] } = validation.data;
    const userId = req.userId!;

    const trip = new Trip({
      name,
      creator: userId,
      participants: Array.from(new Set([userId, ...participants])),
    });

    await trip.save();

    res.status(201).json({ success: true, message: 'Trip created successfully', trip });
  } catch (err) {
    next(err);
  }
};

export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const trips = await Trip.find({ participants: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Trips fetched successfully', trips });
  } catch (err) {
    next(err);
  }
};

export const getRecentTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const trips = await Trip.find({ participants: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ success: true, message: 'Recent trips fetched successfully', trips });
  } catch (err) {
    next(err);
  }
};
