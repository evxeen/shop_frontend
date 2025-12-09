// src/pages/admin/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';

const AdminUsersPage = () => {
    const { user } = useAuth();
    const {
        users,
        usersPagination,
        loadUsers,
        isLoading,
        error
    } = useAdmin();

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Проверяем права админа
        if (user && user.role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }

        loadUsers({ page: currentPage });
    }, [user, navigate, currentPage, loadUsers]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">👥 Управление пользователями</h1>
                    <p className="text-gray-400">Всего пользователей: {usersPagination?.total || 0}</p>
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

            {isLoading ? (
                <div className="flex justify-center items-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => loadUsers()}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold mb-2">Пользователей пока нет</h2>
                    <p className="text-gray-400">Ожидайте регистрации новых пользователей</p>
                </div>
            ) : (
                <>
                    {/* Список пользователей */}
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-dark-700">
                                    <th className="text-left p-4 text-gray-400 font-semibold">ID</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Пользователь</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Роль</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Бонусы</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Заказы</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Рефералы</th>
                                    <th className="text-left p-4 text-gray-400 font-semibold">Дата регистрации</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((userItem) => (
                                    <tr key={userItem.id} className="border-b border-dark-700 hover:bg-dark-750 transition-colors">
                                        <td className="p-4">
                                            <div className="text-white font-mono">{userItem.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white font-medium">
                                                    {userItem.username ? `@${userItem.username}` : userItem.telegramId}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    ID: {userItem.telegramId}
                                                </div>
                                                {userItem.referralCode && (
                                                    <div className="text-gray-400 text-xs">
                                                        Код: {userItem.referralCode}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                            userItem.role === 'ADMIN'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {userItem.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                        </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white font-bold">{userItem.bonusBalance} ₽</div>
                                            <div className="text-gray-400 text-xs">
                                                Потрачено: {userItem.totalSpent} ₽
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">{userItem.ordersCount}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">{userItem.referrals?.length || 0}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-400 text-sm">
                                                {formatDate(userItem.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Пагинация */}
                    {usersPagination && usersPagination.pages > 1 && (
                        <div className="flex justify-center space-x-2 mb-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                ← Назад
                            </button>

                            {Array.from({ length: Math.min(5, usersPagination.pages) }, (_, i) => {
                                let pageNum;
                                if (usersPagination.pages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= usersPagination.pages - 2) {
                                    pageNum = usersPagination.pages - 4 + i;
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
                                onClick={() => setCurrentPage(prev => Math.min(usersPagination.pages, prev + 1))}
                                disabled={currentPage === usersPagination.pages}
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

export default AdminUsersPage;