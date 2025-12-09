// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Интерцептор для автоматической подстановки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Токен невалидный - разлогиниваем
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    // 🔥 НОВЫЙ МЕТОД: Telegram аутентификация
    telegramLogin: (telegramData) => api.post('/auth/telegram', telegramData),
    getMe: () => api.get('/auth/me'),
};

export const productAPI = {
    getAll: (filters = {}) => api.get('/products', { params: filters }),
    getById: (id) => api.get(`/products/${id}`),
};

export const orderAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getAll: () => api.get('/orders'),
    getMyOrders: () => api.get('/orders/my'),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const adminAPI = {
    // Статистика
    getStats: () => api.get('/admin/stats'),

    // Заказы
    getOrders: (params) => api.get('/admin/orders', { params }),
    updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),

    // Пользователи
    getUsers: (params) => api.get('/admin/users', { params }),

    // Товары
    getProducts: () => api.get('/admin/products'),
    createProduct: (productData) => api.post('/admin/products', productData),
    updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
};

export default api;