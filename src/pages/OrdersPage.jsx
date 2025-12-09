// src/pages/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { orderAPI } from '../services/api';

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await orderAPI.getMyOrders();
            setOrders(response.data);
        } catch (err) {
            setError('Ошибка при загрузке заказов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            processing: 'bg-blue-500/20 text-blue-400',
            shipped: 'bg-purple-500/20 text-purple-400',
            delivered: 'bg-green-500/20 text-green-400',
            cancelled: 'bg-red-500/20 text-red-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Ожидает обработки',
            processing: 'В обработке',
            shipped: 'Отправлен',
            delivered: 'Доставлен',
            cancelled: 'Отменен'
        };
        return texts[status] || status;
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold mb-2">Необходима авторизация</h2>
                <p className="text-gray-400">Пожалуйста, войдите в свой аккаунт</p>
                <Link
                    to="/telegram-auth"
                    className="inline-block mt-4 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Войти через Telegram
                </Link>
            </div>
        );
    }

    if (loading) {
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
                    onClick={loadOrders}
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">📦 Мои заказы</h1>
                <Link
                    to="/"
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Вернуться к покупкам
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold mb-2">Заказов пока нет</h2>
                    <p className="text-gray-400 mb-6">Сделайте свой первый заказ!</p>
                    <Link
                        to="/"
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Перейти к товарам
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Заказ #{order.id}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                                    <div className="text-xl font-bold text-white">
                                        {order.totalPrice} ₽
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                                </div>
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <h4 className="text-gray-400 text-sm mb-2">Товары:</h4>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                                                    {item.product.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-8 h-8 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span>📦</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm">{item.product.name}</div>
                                                    <div className="text-gray-400 text-xs">
                                                        {item.quantity} × {item.price} ₽
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-white font-semibold">
                                                {item.quantity * item.price} ₽
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {order.address && (
                                <div className="border-t border-dark-700 pt-4 mt-4">
                                    <h4 className="text-gray-400 text-sm mb-1">Адрес доставки:</h4>
                                    <p className="text-white text-sm">{order.address}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;