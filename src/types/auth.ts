import type { UserRole } from "./models";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName?: string;
  role?: UserRole;
  slugStore?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (token: string, password: string) => void;
  logout: () => void;
}