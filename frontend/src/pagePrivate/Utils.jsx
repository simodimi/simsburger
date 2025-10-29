import axios from "axios";

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      delete axios.defaults.headers.common["Authorization"];

      // Rediriger vers la page de connexion si on est sur une page admin
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
