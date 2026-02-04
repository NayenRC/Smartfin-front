import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT AUTH
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      console.log("Intentando login:", { email, password });

      const response = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error interno del servidor",
      };
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async ({ name, email, password }) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      return { success: true };
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al registrarse",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================
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

export const useAuth = () => useContext(AuthContext);
