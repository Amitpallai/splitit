// src/context/ExpensesContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { expenseApi, type Expense, type ExpensePayload } from "@/services/expenseApi";
import { toast } from "react-hot-toast";

interface ExpensesContextType {
  expenses: Expense[];
  loading: boolean;
  fetchRecentExpenses: (tripId?: string) => void;
  addExpense: (expense: ExpensePayload) => Promise<void>;
  editExpense: (expenseId: string, expense: Partial<ExpensePayload>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecentExpenses = async (tripId?: string) => {
    setLoading(true);
    try {
      const res = await expenseApi.getRecentExpenses(tripId);
      setExpenses(res); // res is Expense[]
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: ExpensePayload) => {
    setLoading(true);
    try {
      const newExpense = await expenseApi.addExpense(expense);
      setExpenses(prev => [newExpense, ...prev]);
      toast.success("Expense added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const editExpense = async (expenseId: string, expense: Partial<ExpensePayload>) => {
    setLoading(true);
    try {
      const updatedExpense = await expenseApi.editExpense(expenseId, expense);
      setExpenses(prev => prev.map(e => (e._id === expenseId ? updatedExpense : e)));
      toast.success("Expense updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit expense");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    setLoading(true);
    try {
      await expenseApi.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(e => e._id !== expenseId));
      toast.success("Expense deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ExpensesContext.Provider value={{ expenses, loading, fetchRecentExpenses, addExpense, editExpense, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error("useExpenses must be used within ExpensesProvider");
  return context;
};
