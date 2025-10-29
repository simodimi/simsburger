// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configurer axios pour inclure le token par défaut
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Vérifier auprès du serveur si le token est valide
  const verifyToken = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return false;
    }
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/verify/token"
      );
      if (response.data.valid) {
        const savedAdmin = localStorage.getItem("adminData");
        if (savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
          setLoading(false);
        }
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token invalide:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem("adminData", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("adminData");
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/";
    }
  };

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
