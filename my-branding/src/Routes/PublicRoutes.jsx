import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";

export const PublicRoutes = ({ children }) => {
    const { isInitializing, isAuthenticated, pendingVerification } = useAuthStore();

    if (isInitializing) return <div>Loading...</div>;
    if (isAuthenticated && !pendingVerification) return <Navigate to="/platform/shop" replace />;
    return children;
};