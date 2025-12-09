// src/pages/admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const {
        stats,
        recentOrders,
        popularProducts,
        loadStats,
        isLoading,
        error
    } = useAdmin();

    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем права админа
        if (user && user.role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }

        loadStats();
    }, [user, navigate, loadStats]);

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещен</h2>
                <p className="text-gray-400">Требуются права администратора</p>
                <Link
                    to="/admin/login"
                    className="inline-block mt-4 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Войти как администратор
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">{error}</div>
                <button
                    onClick={loadStats}
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">🛡️ Панель администратора</h1>
                    <p className="text-gray-400">Управление магазином Vape Shop</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="text-right">
                        <div className="text-white font-semibold">{user.username || 'Администратор'}</div>
                        <div className="text-gray-400 text-sm">Роль: {user.role}</div>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Выйти
                    </button>
                </div>
            </div>

            {/* Навигация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link
                    to="/admin/orders"
                    className="bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl p-4 text-center transition-colors"
                >
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold text-white">Заказы</div>
                    <div className="text-gray-400 text-sm">Управление заказами</div>
                </Link>

                <Link
                    to="/admin/products"
                    className="bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl p-4 text-center transition-colors"
                >
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-semibold text-white">Товары</div>
                    <div className="text-gray-400 text-sm">Управление товарами</div>
                </Link>

                <Link
                    to="/admin/users"
                    className="bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl p-4 text-center transition-colors"
                >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-semibold text-white">Пользователи</div>
                    <div className="text-gray-400 text-sm">Управление клиентами</div>
                </Link>

                <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold text-white">Статистика</div>
                    <div className="text-gray-400 text-sm">Текущая страница</div>
                </div>
            </div>

            {/* Статистика */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{stats.totalOrders}</div>
                        <div className="text-blue-300 text-sm">Всего заказов</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers}</div>
                        <div className="text-green-300 text-sm">Пользователей</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{stats.totalProducts}</div>
                        <div className="text-purple-300 text-sm">Товаров</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{stats.totalRevenue} ₽</div>
                        <div className="text-yellow-300 text-sm">Общая выручка</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Последние заказы */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">📦 Последние заказы</h2>
                        <Link
                            to="/admin/orders"
                            className="text-accent-500 hover:text-accent-400 text-sm"
                        >
                            Все заказы →
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Нет заказов</p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                    <div>
                                        <div className="text-white font-medium">Заказ #{order.id}</div>
                                        <div className="text-gray-400 text-sm">
                                            {order.user?.username || order.user?.telegramId || 'Гость'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">{order.totalPrice} ₽</div>
                                        <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Популярные товары */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                    <h2 className="text-xl font-semibold text-white mb-6">🔥 Популярные товары</h2>

                    {popularProducts.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Нет данных</p>
                    ) : (
                        <div className="space-y-4">
                            {popularProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                            ) : (
                                                <span>📦</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white text-sm line-clamp-1">{product.name}</div>
                                            <div className="text-gray-400 text-xs">{product.price} ₽</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">{product.totalSold || 0} шт</div>
                                        <div className="text-gray-400 text-xs">Продано</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Быстрые действия */}
            <div className="mt-8 bg-dark-800 rounded-2xl p-6 border border-dark-700">
                <h2 className="text-xl font-semibold text-white mb-6">🚀 Быстрые действия</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/products?action=create')}
                        className="bg-accent-500 hover:bg-accent-600 text-white p-4 rounded-lg transition-colors text-center"
                    >
                        <div className="text-2xl mb-2">➕</div>
                        <div className="font-semibold">Добавить товар</div>
                    </button>

                    <button
                        onClick={() => navigate('/admin/orders?filter=pending')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg transition-colors text-center"
                    >
                        <div className="text-2xl mb-2">⏳</div>
                        <div className="font-semibold">Обработать заказы</div>
                    </button>

                    <button
                        onClick={() => window.open('http://localhost:5555', '_blank')}
                        className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors text-center"
                    >
                        <div className="text-2xl mb-2">💾</div>
                        <div className="font-semibold">База данных</div>
                        <div className="text-sm opacity-80">Prisma Studio</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;