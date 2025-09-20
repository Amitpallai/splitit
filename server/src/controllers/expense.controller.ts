import { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";
import Trip from "../models/Trip";
import { expenseAddSchema } from "../utils/validator";

// -------------------- Add Expense --------------------
export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = expenseAddSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, message: validation.error.issues[0].message });
    }

    const { tripId, amount, title, description, paidBy } = validation.data;

    const trip = await Trip.findById(tripId)
      .populate("participants", "username")
      .populate("creator", "username");

    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    const participantUsernames = trip.participants.map((p: any) => p.username.toLowerCase());
    const creatorName = (trip.creator as any)?.username?.toLowerCase();
    const guestParticipants = (trip.guestParticipants || []).map((g: string) => g.toLowerCase());

    let payer = (trip.creator as any)?.username; // default payer

    if (paidBy) {
      const paidByLower = paidBy.toLowerCase();
      if (
        participantUsernames.includes(paidByLower) ||
        guestParticipants.includes(paidByLower) ||
        paidByLower === creatorName
      ) {
        payer = paidBy;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid payer. Must be a participant or guest.",
        });
      }
    }

    const expense = new Expense({
      trip: tripId,
      amount,
      title,
      description,
      paidBy: payer,
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Get Recent Expenses --------------------
export const getRecentExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.query;

    let query: any = {};
    if (tripId) query.trip = tripId;

    const expenses = await Expense.find(query).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      message: "Recent expenses fetched successfully",
      expenses,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Edit Expense --------------------
export const editExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expenseId } = req.params;
    const { title, amount, description, paidBy } = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });

    // Optional: validate paidBy as in addExpense
    if (paidBy) expense.paidBy = paidBy;

    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (description) expense.description = description;

    await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Delete Expense --------------------
export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
