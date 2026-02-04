import axios from 'axios';

// ✅ URL BASE CORRECTA
const API_URL = 'https://backend-finanzas-chatbot-production.up.railway.app/api';

// ======================
// REGISTER
// ======================
export async function register({ name, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return { success: true, ...response.data };
  } catch (error) {
    console.error('REGISTER ERROR:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrarse',
    };
  }
}

// ======================
// LOGIN
// ======================
export async function login({ email, password }) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return { success: true, ...response.data };
  } catch (error) {
    console.error('LOGIN ERROR:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión',
    };
  }
}

// ======================
// PROFILE
// ======================
export async function getProfile() {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
