// src/types/auth.ts

// User / Profile returned by API
export interface User {
  _id: string;
  name: string;
  email: string;
}

// Response from login/signup API
export interface AuthResponse {
  token: string;
}

// Context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
