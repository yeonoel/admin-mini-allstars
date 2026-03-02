import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export const PrivateRoute = () => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== "seller" && user?.role !== "super_admin") return <Navigate to="/" replace />;

    return <Outlet />;
};
