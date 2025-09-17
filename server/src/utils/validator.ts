import { z } from 'zod';

// Signup schema
export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
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
  appearance: z.enum(['light', 'dark']).optional(),
});

// Trip creation schema
export const tripCreateSchema = z.object({
  name: z.string().min(3, "Trip name must be at least 3 characters"),
  participants: z.array(z.string()).optional(),
});

// Expense add schema
export const expenseAddSchema = z.object({
  tripId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  paidBy: z.string().optional(),
});
