import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Contexto de Autenticación
 * - Usa SOLO el backend
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
     LOGIN
  ========================= */
  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Credenciales inválidas"
      );
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const register = async ({ name, email, password }) => {
    try {
      const { data } = await api.post("/register", {
        name,
        email,
        password,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useAuth = () => {
  return useContext(AuthContext);
};
