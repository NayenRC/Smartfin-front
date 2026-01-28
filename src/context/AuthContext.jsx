import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Contexto de autenticación unificado con el Backend de Railway
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Inicialización: Recuperar token de localStorage y validar perfil
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Opcional: Validar token con /auth/profile
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (e) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * 🔑 LOGIN (vía Backend)
   */
  const login = async (email, password) => {
    try {
      console.log("🔐 Intentando login con:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("✅ Login exitoso:", response.data);
      const { token, user: userData } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("❌ ERROR LOGIN:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión"
      };
    }
  };

  /**
   * 📝 REGISTER (vía Backend)
   */
  const register = async (email, password, name = "") => {
    try {
      console.log("📝 Intentando registro:", { email, name });
      // Nota: El backend espera 'name' (nombre en la DB)
      const response = await api.post("/auth/register", {
        email,
        password,
        name: name || email.split('@')[0]
      });

      console.log("✅ Registro exitoso:", response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("❌ ERROR REGISTRO:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrarse"
      };
    }
  };

  /**
   * 🚪 LOGOUT
   */
  const logout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  /**
   * 🔐 getToken
   */
  const getToken = async () => {
    return localStorage.getItem("auth_token");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
