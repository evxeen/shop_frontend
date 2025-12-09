// src/pages/TelegramAuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TelegramLogin from '../components/TelegramLogin';
import useAuth from '../hooks/useAuth';

const TelegramAuthPage = () => {
    const [referralCode, setReferralCode] = useState('');
    const [showReferralInput, setShowReferralInput] = useState(false);

    const { loginWithTelegram, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleTelegramAuth = async (telegramData) => {
        console.log('Получены Telegram данные:', telegramData);

        const result = await loginWithTelegram({
            ...telegramData,
            referralCode: referralCode || undefined
        });

        if (result.success) {
            console.log('Успешный вход!', result.user);
            navigate('/');
        } else {
            console.error('Ошибка входа:', result.error);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                <h1 className="text-2xl font-bold text-white mb-2">🔐 Вход через Telegram</h1>
                <p className="text-gray-400 mb-6">Тестовый режим для разработки</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                        <strong>Ошибка:</strong> {error}
                    </div>
                )}

                {isLoading && (
                    <div className="bg-blue-500/20 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg mb-4">
                        ⏳ Выполняется вход...
                    </div>
                )}

                {/* Реферальный код */}
                {showReferralInput ? (
                    <div className="mb-4 p-4 bg-dark-700 rounded-lg">
                        <label className="block text-gray-400 text-sm mb-2">Реферальный код</label>
                        <input
                            type="text"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            className="w-full bg-dark-600 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Введите код приглашения"
                        />
                        <button
                            onClick={() => setShowReferralInput(false)}
                            className="text-gray-400 text-sm mt-2 hover:text-white"
                        >
                            ✕ Скрыть
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowReferralInput(true)}
                        className="w-full bg-dark-700 hover:bg-dark-600 text-gray-300 py-3 rounded-lg font-semibold transition-colors duration-200 mb-4"
                    >
                        💎 У меня есть реферальный код
                    </button>
                )}

                {/* Кнопка Telegram */}
                <TelegramLogin
                    onAuth={handleTelegramAuth}
                    referralCode={referralCode}
                />

                <div className="text-center text-gray-400 text-sm mt-6">
                    <p>🧪 Это тестовая версия для разработки</p>
                    <p>На продакшене будет реальная кнопка Telegram</p>
                </div>
            </div>
        </div>
    );
};

export default TelegramAuthPage;