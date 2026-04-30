
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated, isInitializing } = useAuthStore();
    if (isInitializing) return <div>...Loading</div>
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
}
