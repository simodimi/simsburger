/*import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const verificationRef = useRef(false); //eviter les appels multiples

  // Config axios pour envoyer les cookies (httpOnly)
  axios.defaults.withCredentials = true;

  // Vérifie la session sur le backend
  const verifyToken = async () => {
    if (verificationRef.current) return;
    verificationRef.current = true;
    try {
      const res = await axios.get("http://localhost:5000/admin/verify/token", {
        withCredentials: true,
      });
      if (res.data.valid) setAdmin(res.data.admin);
      else setAdmin(null);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // Connexion → backend place le cookie httpOnly
  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:5000/admin/login",
      { adminemail: email, adminpassword: password },
      { withCredentials: true }
    );
    setAdmin(res.data);
  };

  // Déconnexion → suppression du cookie serveur
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/admin/logout",
        {},
        { withCredentials: true }
      );
    } catch {}
    setAdmin(null);
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        verifyToken,
        loading,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};*/
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const verificationRef = useRef(false); //eviter les appels multiples

  // Config axios pour envoyer les cookies (httpOnly)
  axios.defaults.withCredentials = true;

  // Vérifie la session sur le backend
  const verifyToken = async () => {
    if (verificationRef.current) return;
    verificationRef.current = true;
    try {
      const res = await axios.get("http://localhost:5000/admin/verify/token", {
        withCredentials: true,
      });
      if (res.data.valid) setAdmin(res.data.admin);
      else setAdmin(null);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // Connexion → backend place le cookie httpOnly
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/login",
        { adminemail: email, adminpassword: password },
        { withCredentials: true }
      );
      setAdmin(res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Erreur login:", error);
      const errorMessage =
        error.response?.data?.message || "Erreur de connexion";
      throw new Error(errorMessage);
    }
  };

  // Déconnexion → suppression du cookie serveur
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/admin/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erreur logout:", error);
    } finally {
      setAdmin(null);
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        verifyToken,
        loading,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
