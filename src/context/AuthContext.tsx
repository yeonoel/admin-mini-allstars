import { createContext, useEffect, useState } from "react";
import type { AuthContextType, AuthUser } from "../types/auth";
import { loginApi } from "../service/auth.service";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);;

interface AuthProviderProps {
    children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // charger les informations au démarage
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to restore session');
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (phone: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi(phone, password);
            setToken(res.token);
            setUser(res.data);
            setIsAuthenticated(true);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            const slugStore = res?.data?.slugStore
            if (res.success) {
                switch (res.data.role) {
                    case 'seller':
                        navigate(`/dashboard/${slugStore}/overview`);
                        break;
                    case 'super_admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message ?? 'Connection échoué');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                error,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}