// src/components/common/Layout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCart from '../../hooks/useCart';

const Layout = ({ children }) => {
    const location = useLocation();
    const { getTotalItems } = useCart();

    const navItems = [
        { path: '/', icon: '🏠', label: 'Главная' },
        { path: '/cart', icon: '🛒', label: 'Корзина', badge: getTotalItems() },
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-20">
            {/* Main content */}
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 border-t border-dark-700 z-50">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-accent-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.badge > 0 && (
                                <span className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
                            )}
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Layout;