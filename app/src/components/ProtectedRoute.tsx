import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";
import LoginLoading from "../pages/LoginLoading";

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth0();
  const { user, loading } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoginLoading />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default ProtectedRoute;
