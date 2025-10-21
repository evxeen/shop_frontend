// src/components/product/ProductCard.jsx
import React from 'react';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product);
    };

    return (
        <div className="bg-dark-800 rounded-2xl p-4 shadow-lg border border-dark-700 hover:border-accent-500 transition-all duration-300">
            <div className="aspect-square bg-dark-700 rounded-xl mb-3 flex items-center justify-center">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                    />
                ) : (
                    <span className="text-4xl">🌫️</span>
                )}
            </div>

            <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-accent-500">
          {product.price} ₽
        </span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock > 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                }`}>
          {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
        </span>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors duration-200 active:scale-95"
            >
                {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
            </button>
        </div>
    );
};

export default ProductCard;