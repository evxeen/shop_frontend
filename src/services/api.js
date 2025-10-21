// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const productAPI = {
    getAll: (filters = {}) => api.get('/products', { params: filters }),
    getById: (id) => api.get(`/products/${id}`),
};

export const orderAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getAll: () => api.get('/orders'),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default api;