import axios from 'axios';

// Obtener la URL base
let baseURL = import.meta.env.VITE_API_URL;

// 🛡️ Eliminar slash final si existe para evitar el error "api//auth"
if (baseURL && baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;