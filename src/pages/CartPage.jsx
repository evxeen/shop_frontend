// src/pages/CartPage.jsx
import React, { useState } from 'react';
import useCart from '../hooks/useCart';
import { orderAPI } from '../services/api';

const CartPage = () => {
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderData, setOrderData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        address: ''
    });

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);

        try {
            const orderPayload = {
                ...orderData,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await orderAPI.create(orderPayload);
            alert('Заказ успешно создан!');
            clearCart();
            setOrderData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                address: ''
            });
        } catch (error) {
            alert('Ошибка при создании заказа: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
                <p className="text-gray-400">Добавьте товары из каталога</p>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Корзина</h1>
                <p className="text-gray-400">{getTotalItems()} товаров</p>
            </header>

            {/* Список товаров */}
            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{item.name}</h3>
                                <p className="text-accent-500 font-bold">{item.price} ₽</p>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-400 hover:text-red-300 p-2"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center"
                                >
                                    -
                                </button>
                                <span className="font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                            <span className="font-bold">
                {item.price * item.quantity} ₽
              </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Итого */}
            <div className="bg-dark-800 rounded-xl p-4 border border-dark-700 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-accent-500">{getTotalPrice()} ₽</span>
                </div>
            </div>

            {/* Форма оформления заказа */}
            <form onSubmit={handleCheckout} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Данные для доставки</h2>

                <input
                    type="text"
                    placeholder="Ваше имя *"
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                    required
                />

                <input
                    type="tel"
                    placeholder="Телефон *"
                    value={orderData.customerPhone}
                    onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value})}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                    required
                />

                <input
                    type="email"
                    placeholder="Email (необязательно)"
                    value={orderData.customerEmail}
                    onChange={(e) => setOrderData({...orderData, customerEmail: e.target.value})}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                />

                <textarea
                    placeholder="Адрес доставки *"
                    value={orderData.address}
                    onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                    rows="3"
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 resize-none"
                    required
                />

                <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-colors duration-200"
                >
                    {isCheckingOut ? 'Оформляем заказ...' : 'Оформить заказ'}
                </button>
            </form>
        </div>
    );
};

export default CartPage;