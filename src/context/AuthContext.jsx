import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

/**
 * Creamos el contexto de autenticación.
 * Lo inicializamos en null para poder detectar usos incorrectos.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider
 * Este componente envuelve TODA la aplicación (en main.jsx)
 * y expone el estado de autenticación y las acciones.
 */
export const AuthProvider = ({ children }) => {
  // Usuario autenticado (objeto user de Supabase)
  const [user, setUser] = useState(null);

  // Sesión completa de Supabase (incluye access_token)
  const [session, setSession] = useState(null);

  // Estado de carga inicial (para saber si Supabase ya respondió)
  const [loading, setLoading] = useState(true);

  /**
   * useEffect de inicialización
   * 1. Obtiene la sesión actual al cargar la app
   * 2. Escucha cambios de autenticación (login / logout)
   */
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listener de cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup del listener
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /**
   * 🔑 LOGIN
   * Inicia sesión con email y password usando Supabase
   */
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  };

  /**
   * 📝 REGISTER
   * Registra un nuevo usuario
   */
  const register = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  };

  /**
   * 🚪 LOGOUT
   * Cierra sesión y limpia estados locales
   */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  /**
   * 🔐 getToken
   * Devuelve el access_token para llamadas al backend
   */
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        getToken,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {/* 
        ❗ IMPORTANTE:
        NO bloqueamos el render con loading.
        El control de loading se hace en rutas o pantallas.
      */}
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el AuthContext
 * Protege contra usos fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
