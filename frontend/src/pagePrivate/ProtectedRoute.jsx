import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, verifyToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Re-vérifier le token à chaque navigation protégée

    verifyToken();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Vérification de la session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page.", {
      toastId: "auth-error", //evite les doublons
    });
    // Rediriger vers la page de connexion
    return <Navigate to="/admin/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
