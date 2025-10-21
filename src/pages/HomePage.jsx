// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../services/api';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getAll();
            setProducts(response.data.data || response.data);
        } catch (err) {
            setError('Ошибка при загрузке товаров');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 py-8">
                {error}
                <button
                    onClick={loadProducts}
                    className="ml-4 bg-accent-500 px-4 py-2 rounded-lg"
                >
                    Повторить
                </button>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Vape Shop</h1>
                <p className="text-gray-400">Качественные жидкости и расходники</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">😴</div>
                    <p>Товары пока не добавлены</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;