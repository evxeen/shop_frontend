// src/hooks/useAdmin.js
import { create } from 'zustand';
import { adminAPI } from '../services/api';

const useAdmin = create((set, get) => ({
    // Статистика
    stats: null,
    recentOrders: [],
    popularProducts: [],

    // Заказы
    orders: [],
    ordersPagination: null,

    // Пользователи
    users: [],
    usersPagination: null,

    // Товары
    products: [],

    // Состояние загрузки
    isLoading: false,
    error: null,

    // 🔥 ЗАГРУЗКА СТАТИСТИКИ
    loadStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminAPI.getStats();
            set({
                stats: response.data.stats,
                recentOrders: response.data.recentOrders,
                popularProducts: response.data.popularProducts,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to load stats',
                isLoading: false
            });
        }
    },

    // 🔥 ЗАГРУЗКА ЗАКАЗОВ
    loadOrders: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminAPI.getOrders(params);
            set({
                orders: response.data.orders,
                ordersPagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to load orders',
                isLoading: false
            });
        }
    },

    // 🔥 ОБНОВЛЕНИЕ СТАТУСА ЗАКАЗА
    updateOrderStatus: async (orderId, status) => {
        try {
            await adminAPI.updateOrderStatus(orderId, status);

            // Обновляем локальный список заказов
            set(state => ({
                orders: state.orders.map(order =>
                    order.id === orderId ? { ...order, status } : order
                )
            }));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update order status'
            };
        }
    },

    // 🔥 ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ
    loadUsers: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminAPI.getUsers(params);
            set({
                users: response.data.users,
                usersPagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to load users',
                isLoading: false
            });
        }
    },

    // 🔥 ЗАГРУЗКА ТОВАРОВ
    loadProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await adminAPI.getProducts();
            set({
                products: response.data,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to load products',
                isLoading: false
            });
        }
    },

    // 🔥 СОЗДАНИЕ ТОВАРА
    createProduct: async (productData) => {
        try {
            const response = await adminAPI.createProduct(productData);

            // Добавляем в локальный список
            set(state => ({
                products: [response.data.product, ...state.products]
            }));

            return { success: true, product: response.data.product };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create product'
            };
        }
    },

    // 🔥 ОБНОВЛЕНИЕ ТОВАРА
    updateProduct: async (id, productData) => {
        try {
            const response = await adminAPI.updateProduct(id, productData);

            // Обновляем в локальном списке
            set(state => ({
                products: state.products.map(product =>
                    product.id === id ? response.data.product : product
                )
            }));

            return { success: true, product: response.data.product };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update product'
            };
        }
    },

    // Очистка ошибок
    clearError: () => set({ error: null }),
}));

export default useAdmin;