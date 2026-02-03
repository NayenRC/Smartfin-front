import axios from 'axios';

// 1. Obtener URL y limpiarla (Blindaje anti doble slash)
let envUrl = import.meta.env.VITE_API_URL;

if (envUrl && envUrl.endsWith('/')) {
    envUrl = envUrl.slice(0, -1);
}

const api = axios.create({
    baseURL: envUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Interceptor para el Token (Mantiene tu sesión activa)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;