import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras Supabase valida sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando...
      </div>
    );
  }

  // No autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Autenticado → renderiza
  return children;
};

export default ProtectedRoute;
