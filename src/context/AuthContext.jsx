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
  // En tu AuthContext.js (ejemplo aproximado)

  const register = async (userData) => {
    const response = await fetch("TU_URL_BACKEND/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // <--- IMPORTANTE
      },
      body: JSON.stringify(userData), // <--- IMPORTANTE
    });

    const data = await response.json();

    // AQUÍ ESTÁ EL TRUCO:
    // Verificamos manualmente si la respuesta no fue exitosa (status fuera de 200-299)
    if (!response.ok) {
      // Lanzamos el error para que tu componente Register.js caiga en el CATCH
      throw new Error(data.message || "Error al registrar usuario");
    }

    // Si todo salió bien, guardamos usuario o retornamos true
    return data;
  };

  // =========================
  // LOGIN
  // =========================
  // En tu AuthContext.js

  const login = async (credentials) => {
    const response = await fetch("TU_URL_BACKEND/api/login", {
      method: "POST",
      headers: {
        // Si te falta esta línea, el servidor no entiende que le envías JSON
        // y por eso dice "Email y contraseña requeridos"
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    // Aquí actualizas tu estado de usuario (setUser)
    setUser(data.user);
    // O guardas el token en localStorage
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
