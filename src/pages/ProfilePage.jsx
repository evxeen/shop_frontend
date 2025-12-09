// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();
    const [referralStats, setReferralStats] = useState(null);
    const [bonusHistory, setBonusHistory] = useState([]); // 🔥 НАЧАЛЬНОЕ ЗНАЧЕНИЕ - ПУСТОЙ МАССИВ

    // Загружаем статистику рефералов
    useEffect(() => {
        if (user) {
            loadReferralStats();
            loadBonusHistory();
        }
    }, [user]);

    const loadReferralStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/referral-stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load referral stats');
            }

            const data = await response.json();
            setReferralStats(data);
        } catch (error) {
            console.error('Error loading referral stats:', error);
            setReferralStats(null);
        }
    };

    const loadBonusHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/bonus-history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load bonus history');
            }

            const data = await response.json();

            // 🔥 УБЕДИМСЯ ЧТО ЭТО МАССИВ
            if (Array.isArray(data)) {
                setBonusHistory(data);
            } else {
                console.warn('Bonus history is not an array:', data);
                setBonusHistory([]);
            }
        } catch (error) {
            console.error('Error loading bonus history:', error);
            setBonusHistory([]); // 🔥 УСТАНАВЛИВАЕМ ПУСТОЙ МАССИВ ПРИ ОШИБКЕ
        }
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

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">👤 Личный кабинет</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Программа постоянного клиента */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Основная информация */}
                    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">🌟 Программа постоянного клиента</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white mb-1">5%</div>
                                <div className="text-purple-300 text-sm">Кэшбэк с покупок</div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white mb-1">{user.ordersCount || 0}</div>
                                <div className="text-blue-300 text-sm">Заказов</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Всего потрачено:</span>
                                <span className="text-white font-semibold">{user.totalSpent || 0} ₽</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Накоплено бонусов:</span>
                                <span className="text-green-400 font-semibold">{user.bonusBalance || 0} ₽</span>
                            </div>
                        </div>
                    </div>

                    {/* История бонусов */}
                    {/* 🔥 ИСПРАВЛЯЕМ ПРОВЕРКУ НА МАССИВ */}
                    {!bonusHistory || !Array.isArray(bonusHistory) || bonusHistory.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Пока нет операций с бонусами</p>
                    ) : (
                        <div className="space-y-3">
                            {bonusHistory.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-dark-700 last:border-b-0">
                                    <div>
                                        <div className="text-white text-sm">{transaction.description}</div>
                                        <div className="text-gray-400 text-xs">
                                            {new Date(transaction.createdAt).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} ₽
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Боковая панель */}
                <div className="space-y-6">
                    {/* Реферальная программа */}
                    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">👥 Приведи друга</h2>

                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400 mb-1">
                                    +5 ₽
                                </div>
                                <div className="text-yellow-300 text-sm">за каждого друга</div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Ваш реферальный код</label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-dark-700 text-white font-mono text-lg px-4 py-3 rounded-lg text-center">
                                        {user.referralCode}
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(user.referralCode)}
                                        className="bg-dark-600 hover:bg-dark-500 text-white px-4 py-3 rounded-lg transition-colors"
                                        title="Скопировать код"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            {referralStats && (
                                <div className="bg-dark-700 rounded-lg p-3">
                                    <div className="text-center text-white font-semibold mb-1">
                                        {referralStats.completedReferrals} из {referralStats.totalReferrals}
                                    </div>
                                    <div className="text-gray-400 text-sm text-center">
                                        друзей с выполненными заказами
                                    </div>
                                </div>
                            )}

                            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
                                <p className="text-yellow-400 text-sm text-center">
                                    <strong>Дополнительно к вашим 5%!</strong> Расскажите друзьям и получайте бонусы.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Быстрые действия */}
                    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                        <h2 className="text-xl font-semibold text-white mb-4">🚀 Быстрые действия</h2>

                        <div className="space-y-3">
                            <Link
                                to="/orders"
                                className="flex items-center space-x-3 bg-dark-700 hover:bg-dark-600 text-white p-3 rounded-lg transition-colors"
                            >
                                <span className="text-xl">📦</span>
                                <span>Мои заказы</span>
                            </Link>

                            <Link
                                to="/"
                                className="flex items-center space-x-3 bg-dark-700 hover:bg-dark-600 text-white p-3 rounded-lg transition-colors"
                            >
                                <span className="text-xl">🛒</span>
                                <span>Продолжить покупки</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;