import express from 'express';
import { addExpense, getRecentExpenses } from '../controllers/expense.controller';

const router = express.Router();

router.post('/', addExpense);
router.get('/recent', getRecentExpenses);

export default router;