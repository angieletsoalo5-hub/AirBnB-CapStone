import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="admin-auth-loading" role="status">Checking your account…</p>;
  }

  if (!user || user.role !== "host") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;