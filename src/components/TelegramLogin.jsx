// src/components/TelegramLogin.jsx
import React, { useState } from 'react';

const TelegramLoginButton = ({ onAuth, referralCode = '' }) => {
    const [testData, setTestData] = useState({
        id: '123456789',
        first_name: 'Тестовый Пользователь',
        username: 'testuser'
    });

    const handleTestAuth = (e) => {
        e.preventDefault();

        const mockTelegramData = {
            id: testData.id,
            first_name: testData.first_name,
            username: testData.username,
            auth_date: Math.floor(Date.now() / 1000),
            hash: 'test_hash_development_' + Date.now()
        };

        console.log('Отправляем тестовые данные:', mockTelegramData);
        onAuth(mockTelegramData);
    };

    return (
        <div className="space-y-4">
            {/* Заголовок */}
            <div className="text-center">
                <div className="text-4xl mb-2">🧪</div>
                <h3 className="text-lg font-semibold text-white">Тестовый режим Telegram</h3>
                <p className="text-gray-400 text-sm">На продакшене будет реальная кнопка Telegram</p>
            </div>

            {/* Тестовая форма */}
            <form onSubmit={handleTestAuth} className="space-y-3 bg-dark-700 p-4 rounded-lg">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Telegram ID</label>
                    <input
                        type="text"
                        value={testData.id}
                        onChange={(e) => setTestData({...testData, id: e.target.value})}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                        placeholder="123456789"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Имя</label>
                    <input
                        type="text"
                        value={testData.first_name}
                        onChange={(e) => setTestData({...testData, first_name: e.target.value})}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                        placeholder="Иван Иванов"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Username</label>
                    <input
                        type="text"
                        value={testData.username}
                        onChange={(e) => setTestData({...testData, username: e.target.value})}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                        placeholder="ivanov"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 mt-4"
                >
                    🔐 Тестовый вход через Telegram
                </button>
            </form>

            {/* Информация о реферальном коде */}
            {referralCode && (
                <div className="bg-blue-500/20 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg">
                    <p className="text-sm">Реферальный код: <strong>{referralCode}</strong></p>
                </div>
            )}
        </div>
    );
};

export default TelegramLoginButton;