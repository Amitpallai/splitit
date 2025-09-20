"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.editExpense = exports.getRecentExpenses = exports.addExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const Trip_1 = __importDefault(require("../models/Trip"));
const validator_1 = require("../utils/validator");
// -------------------- Add Expense --------------------
const addExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const validation = validator_1.expenseAddSchema.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(400)
                .json({ success: false, message: validation.error.issues[0].message });
        }
        const { tripId, amount, title, description, paidBy } = validation.data;
        const trip = yield Trip_1.default.findById(tripId)
            .populate("participants", "username")
            .populate("creator", "username");
        if (!trip)
            return res.status(404).json({ success: false, message: "Trip not found" });
        const participantUsernames = trip.participants.map((p) => p.username.toLowerCase());
        const creatorName = (_b = (_a = trip.creator) === null || _a === void 0 ? void 0 : _a.username) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        const guestParticipants = (trip.guestParticipants || []).map((g) => g.toLowerCase());
        let payer = (_c = trip.creator) === null || _c === void 0 ? void 0 : _c.username; // default payer
        if (paidBy) {
            const paidByLower = paidBy.toLowerCase();
            if (participantUsernames.includes(paidByLower) ||
                guestParticipants.includes(paidByLower) ||
                paidByLower === creatorName) {
                payer = paidBy;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payer. Must be a participant or guest.",
                });
            }
        }
        const expense = new Expense_1.default({
            trip: tripId,
            amount,
            title,
            description,
            paidBy: payer,
        });
        yield expense.save();
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addExpense = addExpense;
// -------------------- Get Recent Expenses --------------------
const getRecentExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.query;
        let query = {};
        if (tripId)
            query.trip = tripId;
        const expenses = yield Expense_1.default.find(query).sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            success: true,
            message: "Recent expenses fetched successfully",
            expenses,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getRecentExpenses = getRecentExpenses;
// -------------------- Edit Expense --------------------
const editExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expenseId } = req.params;
        const { title, amount, description, paidBy } = req.body;
        const expense = yield Expense_1.default.findById(expenseId);
        if (!expense)
            return res.status(404).json({ success: false, message: "Expense not found" });
        // Optional: validate paidBy as in addExpense
        if (paidBy)
            expense.paidBy = paidBy;
        if (title)
            expense.title = title;
        if (amount)
            expense.amount = amount;
        if (description)
            expense.description = description;
        yield expense.save();
        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.editExpense = editExpense;
// -------------------- Delete Expense --------------------
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expenseId } = req.params;
        const expense = yield Expense_1.default.findByIdAndDelete(expenseId);
        if (!expense)
            return res.status(404).json({ success: false, message: "Expense not found" });
        res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteExpense = deleteExpense;
