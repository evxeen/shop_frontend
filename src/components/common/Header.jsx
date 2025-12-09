// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const Header = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();

    return (
        <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Логотип */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🌫️</span>
                        <span className="text-xl font-bold text-white">Vape Shop</span>
                    </Link>

                    {/* Навигация */}
                    <nav className="flex items-center space-x-4">
                        {/* Корзина */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="text-2xl">🛒</span>
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
                            )}
                        </Link>

                        {/* Авторизация / Профиль */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/orders"
                                    className="text-gray-300 hover:text-white transition-colors hidden md:block"
                                >
                                    📦 Мои заказы
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    👤 {user.username || 'Профиль'}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/telegram-auth"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Войти через Telegram
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;