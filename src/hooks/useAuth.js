// src/hooks/useAuth.js
import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuth = create((set, get) => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isLoading: false,
    error: null,

    // 🔥 НОВЫЙ МЕТОД: Вход через Telegram
    loginWithTelegram: async (telegramData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.telegramLogin(telegramData);
            const { user, token } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(user));

            set({ user, token, isLoading: false });
            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Telegram login failed';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // 🔥 НОВЫЙ МЕТОД: Вход через Telegram с реферальным кодом
    loginWithTelegramAndReferral: async (telegramData, referralCode) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.telegramLogin({
                ...telegramData,
                referralCode
            });
            const { user, token } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(user));

            set({ user, token, isLoading: false });
            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Telegram login failed';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Остальные методы остаются...
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        set({ user: null, token: null, error: null });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return;
        }

        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                set({ user: JSON.parse(userData), token });
            }

            const response = await authAPI.getMe();
            set({ user: response.data.user });
        } catch (error) {
            get().logout();
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuth;