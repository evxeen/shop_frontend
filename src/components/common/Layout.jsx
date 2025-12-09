// src/components/common/Layout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Header from './Header';

const Layout = ({ children }) => {
    const location = useLocation();
    const { checkAuth } = useAuth();

    // Проверяем аутентификацию при загрузке
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Убираем старую мобильную навигацию - теперь есть Header */}
        </div>
    );
};

export default Layout;