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
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      // Si tenemos token y usuario guardado, restauramos la sesión
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("user");
      }
      
      // Verificamos que el token siga siendo válido
      authService
        .getProfile()
        .then((data) => {
          const userData = data.user || data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => {
          // Token inválido, limpiamos todo
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else if (token) {
      // Solo tenemos token, intentamos obtener el perfil
      authService
        .getProfile()
        .then((data) => {
          const userData = data.user || data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
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

    // Guardamos el usuario en el estado y en localStorage
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }

    return { success: true, ...data };
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Mostrar loading mientras se verifica autenticación (con estilos inline para evitar problemas de CSS)
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617'
      }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #1e293b',
            borderTopColor: '#22c55e',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0 }}>Cargando...</p>
        </div>
      </div>
    );
  }

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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);