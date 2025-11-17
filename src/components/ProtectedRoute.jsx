import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  // Si no está logueado → login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no está permitido → error 403
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
