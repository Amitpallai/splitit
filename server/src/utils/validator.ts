import { z } from "zod";

// ------------------- AUTH SCHEMAS -------------------

// Signup schema
export const signupSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  appearance: z.enum(["light", "dark"]).optional(),
});

// ------------------- TRIP SCHEMAS -------------------

// Trip creation schema
export const tripCreateSchema = z.object({
  tripName: z.string().min(3, "Trip name must be at least 3 characters long"),
  location: z.string().min(2, "Location is required"),
  participants: z
    .array(z.string().min(1, "Participant ID cannot be empty"))
    .optional(), // array of userIds (strings)
});

// Trip update schema (partial to allow partial updates)
export const tripUpdateSchema = tripCreateSchema.partial();

// ------------------- EXPENSE SCHEMAS -------------------

// Expense add schema
export const expenseAddSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  amount: z.number().positive("Amount must be positive"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  paidBy: z.string().optional(), // can be userId
});

// Expense update schema (optional fields)
export const expenseUpdateSchema = expenseAddSchema.partial();
