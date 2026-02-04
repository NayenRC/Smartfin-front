import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT AUTH (al cargar la app)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      authService
        .getProfile()
        .then((data) => {
          setUser(data.user || data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async ({ name, email, password }) => {
    try {
      const data = await authService.register({ name, email, password });

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error al registrarse",
      };
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });

      setUser(data.user);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Credenciales inválidas",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
