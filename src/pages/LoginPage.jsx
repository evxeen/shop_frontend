// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(formData);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                <h1 className="text-2xl font-bold text-white mb-6">Вход в аккаунт</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Ваш пароль"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-accent-500 hover:text-accent-400">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;