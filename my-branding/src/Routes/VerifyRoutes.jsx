
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext"

export const VerifyRoutes = ({ children }) => {
    const { pendingVerification } = useAuthStore();

    if (!pendingVerification) {
        return <Navigate to="/signup" replace />
    }

    return children;
}