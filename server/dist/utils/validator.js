"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseUpdateSchema = exports.expenseAddSchema = exports.tripUpdateSchema = exports.tripCreateSchema = exports.profileUpdateSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
// ------------------- AUTH SCHEMAS -------------------
// Signup schema
exports.signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Name must be at least 3 characters"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// Login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// Profile update schema
exports.profileUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    appearance: zod_1.z.enum(["light", "dark"]).optional(),
});
// ------------------- TRIP SCHEMAS -------------------
// Trip creation schema
exports.tripCreateSchema = zod_1.z.object({
    tripName: zod_1.z.string().min(3, "Trip name must be at least 3 characters long"),
    location: zod_1.z.string().min(2, "Location is required"),
    participants: zod_1.z
        .array(zod_1.z.string().min(1, "Participant ID cannot be empty"))
        .optional(), // array of userIds (strings)
});
// Trip update schema (partial to allow partial updates)
exports.tripUpdateSchema = exports.tripCreateSchema.partial();
// ------------------- EXPENSE SCHEMAS -------------------
// Expense add schema
exports.expenseAddSchema = zod_1.z.object({
    tripId: zod_1.z.string().min(1, "Trip ID is required"),
    amount: zod_1.z.number().positive("Amount must be positive"),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    paidBy: zod_1.z.string().optional(), // can be userId
});
// Expense update schema (optional fields)
exports.expenseUpdateSchema = exports.expenseAddSchema.partial();
