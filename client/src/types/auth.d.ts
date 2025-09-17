// User type returned by /users/profile
export interface User {
  _id: string;
  name: string;
  email: string;
  // Add any other fields returned by your API
}

// AuthContext type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
