import express from 'express';
import {
    addExpense,
    getRecentExpenses,
    editExpense,
    deleteExpense,
} from '../controllers/expense.controller';

const router = express.Router();

// Add a new expense
router.post('/', addExpense);

// Get recent expenses (optional query: ?tripId=...)
router.get('/', getRecentExpenses);

// Edit an existing expense by ID
router.put('/:expenseId', editExpense);

// Delete an expense by ID
router.delete('/:expenseId', deleteExpense);

export default router;
