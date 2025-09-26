import axios from "axios";

// Use env variable for base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/expenses";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important if backend uses cookies
});

// Attach token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expense types
export interface ExpensePayload {
  tripId: string;
  title: string;
  amount: number;
  paidBy?: string;
  description?: string;
}

export interface Expense {
  _id: string;
  trip: string;
  title: string;
  amount: number;
  paidBy: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Expense APIs
export const expenseApi = {
  addExpense: async (expense: ExpensePayload): Promise<Expense> => {
    const { data } = await apiClient.post("/", expense);
    return data;
  },

  getRecentExpenses: async (tripId?: string): Promise<Expense[]> => {
    const url = tripId ? `/?tripId=${tripId}` : "/recent";
    const { data } = await apiClient.get(url);
    return data;
  },

  editExpense: async (expenseId: string, expense: Partial<ExpensePayload>): Promise<Expense> => {
    const { data } = await apiClient.put(`/${expenseId}`, expense);
    return data;
  },

  deleteExpense: async (expenseId: string): Promise<{ success: boolean }> => {
    const { data } = await apiClient.delete(`/${expenseId}`);
    return data;
  },
};
