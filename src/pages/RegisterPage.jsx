// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        referralCode: ''
    });

    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await register(formData);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                <h1 className="text-2xl font-bold text-white mb-6">Регистрация</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Email *</label>
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
                        <label className="block text-gray-400 text-sm mb-2">Пароль *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Не менее 6 символов"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="+7 (999) 999-99-99"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Реферальный код</label>
                        <input
                            type="text"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                            placeholder="Необязательно"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-accent-500 hover:text-accent-400">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;