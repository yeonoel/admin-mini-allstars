export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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