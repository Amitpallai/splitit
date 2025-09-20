"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const router = express_1.default.Router();
// Add a new expense
router.post('/', expense_controller_1.addExpense);
// Get recent expenses (optional query: ?tripId=...)
router.get('/', expense_controller_1.getRecentExpenses);
// Edit an existing expense by ID
router.put('/:expenseId', expense_controller_1.editExpense);
// Delete an expense by ID
router.delete('/:expenseId', expense_controller_1.deleteExpense);
exports.default = router;
