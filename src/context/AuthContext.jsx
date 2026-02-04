import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

// URL del backend desde variable de entorno
const API_URL = import.meta.env.VITE_API_URL || "https://backend-finanzas-chatbot-production.up.railway.app";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT AUTH (Persistencia al recargar)
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
  const register = async (name, email, password) => {
    // Validación ANTES del fetch
    if (!name || !email || !password) {
      console.error("Nombre, email o password vacío");
      return { success: false, message: "Nombre, email y contraseña son requeridos" };
    }

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario");
    }

    return { success: true, ...data };
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    // Validación ANTES del fetch
    if (!email || !password) {
      console.error("Email o password vacío");
      return { success: false, message: "Email y contraseña son requeridos" };
    }

    const fullUrl = `${API_URL}/api/auth/login`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Error al iniciar sesión" };
    }

    // Guardamos el token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Guardamos el usuario en el estado
    setUser(data.user);

    return { success: true, ...data };
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