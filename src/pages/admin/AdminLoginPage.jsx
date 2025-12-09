// src/pages/admin/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminLoginPage = () => {
    const [telegramId, setTelegramId] = useState('');
    const [username, setUsername] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState('');

    const { loginWithTelegram } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        if (!telegramId) {
            setMessage('Введите Telegram ID');
            return;
        }

        try {
            console.log('Пытаемся войти как админ с Telegram ID:', telegramId);

            const response = await fetch('http://localhost:5000/api/auth/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: telegramId,
                    first_name: username || 'Admin',
                    username: username,
                    auth_date: Math.floor(Date.now() / 1000),
                    hash: 'admin_login_' + Date.now()
                })
            });

            const data = await response.json();
            console.log('API ответ:', data);

            if (response.ok) {
                // Сохраняем токен
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                console.log('Сохраненные данные пользователя:', data.user);
                console.log('Роль пользователя:', data.user.role);

                // 🔥 ПРОВЕРЯЕМ РОЛЬ
                if (data.user.role === 'ADMIN') {
                    console.log('Доступ разрешен! Переход к дашборду...');
                    navigate('/admin/dashboard');
                } else {
                    console.log('Роль не ADMIN:', data.user.role);
                    setMessage(`У вас нет прав администратора. Ваша роль: ${data.user.role}`);
                    // Очищаем данные неадмина
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            } else {
                console.log('Ошибка API:', data);
                setMessage(data.error || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            setMessage('Ошибка входа: ' + error.message);
        }
    };

    const handleCreateAdmin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId, username })
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем токен и входим
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                setMessage('Администратор создан! Автоматический вход...');
                setTimeout(() => navigate('/admin/dashboard'), 1000);
            } else {
                setMessage(data.error || 'Ошибка создания администратора');
            }
        } catch (error) {
            setMessage('Ошибка: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h1 className="text-2xl font-bold text-white">Панель администратора</h1>
                    <p className="text-gray-400">Vape Shop Management</p>
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg ${
                        message.includes('Успешно') || message.includes('создан')
                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                            : 'bg-red-500/20 border border-red-500 text-red-400'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Telegram ID</label>
                        <input
                            type="text"
                            value={telegramId}
                            onChange={(e) => setTelegramId(e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Введите Telegram ID"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Username (опционально)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Введите username"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="flex-1 bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Войти как админ
                        </button>

                        <button
                            type="button"
                            onClick={handleCreateAdmin}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Создать админа
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        {isCreating ? 'Скрыть инструкцию' : 'Показать инструкцию'}
                    </button>

                    {isCreating && (
                        <div className="mt-4 p-4 bg-dark-700 rounded-lg text-left">
                            <p className="text-gray-400 text-sm">
                                <strong>Инструкция:</strong>
                                <br />1. Введите Telegram ID (например: admin123)
                                <br />2. Нажмите "Создать админа"
                                <br />3. Затем войдите с теми же данными
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        ← Вернуться в магазин
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;