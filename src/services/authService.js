import axios from 'axios';

// ⚠️ URL BASE DEL BACKEND (Railway)
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

    // Guardar token si viene
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('REGISTER ERROR:', error.response?.data || error.message);
    throw error.response?.data || error;
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

    // Guardar token
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('LOGIN ERROR:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

// ======================
// PROFILE (TEST TOKEN)
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
