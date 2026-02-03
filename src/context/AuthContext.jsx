import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Contexto de autenticación
 * - Usa SOLO el backend para auth
 * - Guarda token + user en localStorage
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     INIT AUTH
     Recuperar sesión guardada
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     🔑 LOGIN
  ========================= */
  const login = async (email, password) => {
    setLoading(true);

    try {
      console.log("🔐 Intentando login:", email);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error("Respuesta inválida del servidor");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error interno del servidor";

      console.error("❌ LOGIN ERROR:", message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     📝 REGISTER
  ========================= */
  const register = async (email, password, name = "") => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name: name || email.split("@")[0],
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al registrarse";

      console.error("❌ REGISTER ERROR:", message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🚪 LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /* =========================
     🔐 GET TOKEN
  ========================= */
  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getToken,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   Hook de consumo
========================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
