// src/pages/admin/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';

const AdminOrdersPage = () => {
    const { user } = useAuth();
    const {
        orders,
        ordersPagination,
        loadOrders,
        updateOrderStatus,
        isLoading,
        error
    } = useAdmin();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

    useEffect(() => {
        // Проверяем права админа
        if (user && user.role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }

        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (currentPage > 1) params.page = currentPage;

        loadOrders(params);

        // Обновляем URL
        const newSearchParams = new URLSearchParams();
        if (statusFilter !== 'all') newSearchParams.set('status', statusFilter);
        if (currentPage > 1) newSearchParams.set('page', currentPage);
        setSearchParams(newSearchParams);

    }, [user, navigate, statusFilter, currentPage, loadOrders, setSearchParams]);

    const handleStatusChange = async (orderId, newStatus) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            alert('Статус заказа обновлен');
        } else {
            alert('Ошибка: ' + result.error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
            processing: 'bg-blue-500/20 text-blue-400 border-blue-500',
            shipped: 'bg-purple-500/20 text-purple-400 border-purple-500',
            delivered: 'bg-green-500/20 text-green-400 border-green-500',
            cancelled: 'bg-red-500/20 text-red-400 border-red-500'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Ожидает',
            processing: 'В обработке',
            shipped: 'Отправлен',
            delivered: 'Доставлен',
            cancelled: 'Отменен'
        };
        return texts[status] || status;
    };

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещен</h2>
                <p className="text-gray-400">Требуются права администратора</p>
            </div>
        );
    }

    const statusOptions = [
        { value: 'all', label: 'Все статусы' },
        { value: 'pending', label: 'Ожидающие' },
        { value: 'processing', label: 'В обработке' },
        { value: 'shipped', label: 'Отправленные' },
        { value: 'delivered', label: 'Доставленные' },
        { value: 'cancelled', label: 'Отмененные' }
    ];

    const nextStatus = (currentStatus) => {
        const flow = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = flow.indexOf(currentStatus);
        return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : currentStatus;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">📦 Управление заказами</h1>
                    <p className="text-gray-400">Всего заказов: {ordersPagination?.total || 0}</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Назад
                    </button>
                </div>
            </div>

            {/* Фильтры */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Статус заказа</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-accent-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="text-gray-400 text-sm">
                        Страница {currentPage} из {ordersPagination?.pages || 1}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => loadOrders()}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold mb-2">Заказов не найдено</h2>
                    <p className="text-gray-400">Измените фильтры или попробуйте позже</p>
                </div>
            ) : (
                <>
                    {/* Список заказов */}
                    <div className="space-y-4 mb-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div className="mb-4 md:mb-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">Заказ #{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                                        </div>

                                        <div className="text-gray-400 text-sm space-y-1">
                                            <div>
                                                <strong>Клиент:</strong>{' '}
                                                {order.user?.username
                                                    ? `@${order.user.username}`
                                                    : order.user?.telegramId
                                                        ? `ID: ${order.user.telegramId}`
                                                        : 'Гость'
                                                }
                                            </div>
                                            <div>
                                                <strong>Телефон:</strong> {order.customerPhone}
                                            </div>
                                            <div>
                                                <strong>Дата:</strong>{' '}
                                                {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            {order.address && (
                                                <div>
                                                    <strong>Адрес:</strong> {order.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white mb-2">
                                            {order.totalPrice} ₽
                                        </div>

                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, nextStatus(order.status))}
                                                    className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                                >
                                                    Следующий статус
                                                </button>
                                            )}

                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
                                            >
                                                <option value="pending">Ожидает</option>
                                                <option value="processing">В обработке</option>
                                                <option value="shipped">Отправлен</option>
                                                <option value="delivered">Доставлен</option>
                                                <option value="cancelled">Отменить</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Товары в заказе */}
                                <div className="border-t border-dark-700 pt-4">
                                    <h4 className="text-gray-400 text-sm mb-3">Товары ({order.items.length}):</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-dark-600 rounded-lg flex items-center justify-center">
                                                        {item.product.imageUrl ? (
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={item.product.name}
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span className="text-lg">📦</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-white text-sm font-medium">{item.product.name}</div>
                                                        <div className="text-gray-400 text-xs">
                                                            Артикул: {item.product.id} • Категория: {item.product.category}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-bold">{item.quantity} × {item.price} ₽</div>
                                                    <div className="text-gray-400 text-sm">{item.quantity * item.price} ₽</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Пагинация */}
                    {ordersPagination && ordersPagination.pages > 1 && (
                        <div className="flex justify-center space-x-2 mb-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                ← Назад
                            </button>

                            {Array.from({ length: Math.min(5, ordersPagination.pages) }, (_, i) => {
                                let pageNum;
                                if (ordersPagination.pages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= ordersPagination.pages - 2) {
                                    pageNum = ordersPagination.pages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-accent-500 text-white'
                                                : 'bg-dark-700 hover:bg-dark-600 text-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(ordersPagination.pages, prev + 1))}
                                disabled={currentPage === ordersPagination.pages}
                                className="bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Вперед →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminOrdersPage;