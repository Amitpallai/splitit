import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense';
import Trip from '../models/Trip';
import { expenseAddSchema } from '../utils/validator';

export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = expenseAddSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { tripId, amount, description, paidBy } = validation.data;
    const userId = req.userId!;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const expense = new Expense({
      trip: tripId,
      amount,
      description,
      paidBy: paidBy || userId,
    });
    await expense.save();

    res.status(201).json({ success: true, message: 'Expense added successfully', expense });
  } catch (err) {
    next(err);
  }
};

export const getRecentExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const expenses = await Expense.find({ paidBy: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, message: 'Recent expenses fetched successfully', expenses });
  } catch (err) {
    next(err);
  }
};
