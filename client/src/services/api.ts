import axios from "axios";
import type { AuthResponse, User } from "../types/auth";

// Use env variable for base URL
const API_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important for cookies
});

// Attach token to header if exists in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
};

export const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", { username, email, password });
  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/auth/profile");
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};
