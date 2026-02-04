// ======================
// URL BASE
// ======================
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-finanzas-chatbot-production.up.railway.app';

// ======================
// LOGIN
// ======================
export async function login(email, password) {
  // Validación ANTES del fetch
  if (!email || !password) {
    console.error("Email o password vacío");
    return { success: false, message: "Email y contraseña son requeridos" };
  }

  console.log("LOGIN payload:", { email, password });

  const response = await fetch(`${API_URL}/api/auth/login`, {
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
    // console.error('LOGIN ERROR:', data); // SILENCED TO DEBUG EXECUTION PATH
    return {
      success: false,
      message: data.message || 'Error al iniciar sesión',
    };
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return { success: true, ...data };
}

// ======================
// REGISTER
// ======================
export async function register(email, password) {
  // Validación ANTES del fetch
  if (!email || !password) {
    console.error("Email o password vacío");
    return { success: false, message: "Email y contraseña son requeridos" };
  }

  console.log("REGISTER payload:", { email, password });

  const response = await fetch(`${API_URL}/api/auth/register`, {
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
    console.error('REGISTER ERROR:', data);
    return {
      success: false,
      message: data.message || 'Error al registrarse',
    };
  }

  return { success: true, ...data };
}

// ======================
// PROFILE
// ======================
export async function getProfile() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener perfil');
  }

  return response.json();
}
