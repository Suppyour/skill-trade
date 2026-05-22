import axios from 'axios';

export const apiClient = axios.create({
  // Наш .NET Web API слушает на порту 5000 (HTTP) или 5001 (HTTPS)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5107/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для автоматического логирования/обработки ошибок (необязательно, но полезно)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
