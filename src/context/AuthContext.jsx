import { createContext, useContext, useEffect, useState } from "react";
// Si no usas authService para login/register, asegúrate de que getProfile sí exista ahí
import * as authService from "../services/authService";

const AuthContext = createContext(null);

// TU URL REAL DE RAILWAY (Copiada de tu captura de pantalla)
const API_URL = "https://backend-finanzas-chatbot-production.up.railway.app";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT AUTH (Persistencia al recargar)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Asumimos que authService.getProfile usa el token guardado
      authService
        .getProfile()
        .then((data) => {
          setUser(data.user || data);
        })
        .catch(() => {
          // Si el token expiró o es inválido, limpiamos todo
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
  const register = async (userData) => {
    // Usamos la constante API_URL
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Esto hará que tu componente Register muestre el error rojo
      throw new Error(data.message || "Error al registrar usuario");
    }

    // Opcional: Si tu backend devuelve token al registrar, podrías hacer login automático aquí.
    return data;
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (credentials) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    // === CORRECCIÓN IMPORTANTE ===
    // 1. Guardamos el token para que no se pierda al recargar
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    
    // 2. Guardamos el usuario en el estado
    setUser(data.user); 
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