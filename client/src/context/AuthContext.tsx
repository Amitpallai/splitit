"use client";

import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { login as apiLogin, signup as apiSignup, getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // directly import Sonner
import type { User, AuthContextType } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser().finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      return profile;
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      logout();
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token } = await apiLogin(email, password);
      if (!token) throw new Error("Invalid token received");

      localStorage.setItem("token", token);

      // Fetch user and wait for it
      const profile = await fetchUser();

      toast.success(`Welcome back, ${profile.name}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { token } = await apiSignup(name, email, password);
      if (!token) throw new Error("Invalid token received");

      localStorage.setItem("token", token);

      // Fetch user after signup
      await fetchUser();

      toast.success(`Account created! Welcome, ${name}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
    toast("Logged out successfully"); // optional simple toast
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
