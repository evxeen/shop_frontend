// src/pages/admin/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';

const AdminProductsPage = () => {
    const { user } = useAuth();
    const {
        products,
        loadProducts,
        createProduct,
        updateProduct,
        isLoading,
        error
    } = useAdmin();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [showForm, setShowForm] = useState(searchParams.get('action') === 'create');
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        // Проверяем права админа
        if (user && user.role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }

        loadProducts();
    }, [user, navigate, loadProducts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            imageUrl: product.imageUrl || ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            isActive: true
        };

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }

        if (result.success) {
            alert(editingProduct ? 'Товар обновлен' : 'Товар создан');
            setShowForm(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: '',
                imageUrl: ''
            });
            loadProducts();
        } else {
            alert('Ошибка: ' + result.error);
        }
    };

    const handleToggleActive = async (product) => {
        const result = await updateProduct(product.id, {
            isActive: !product.isActive
        });

        if (result.success) {
            alert(`Товар ${product.isActive ? 'деактивирован' : 'активирован'}`);
            loadProducts();
        } else {
            alert('Ошибка: ' + result.error);
        }
    };

    const categories = ['Жидкости', 'Расходники', 'Устройства', 'Аккумуляторы', 'Аксессуары'];

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
                    <h1 className="text-3xl font-bold text-white">🛒 Управление товарами</h1>
                    <p className="text-gray-400">Всего товаров: {products.length}</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Назад
                    </button>

                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setShowForm(true);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                stock: '',
                                category: categories[0],
                                imageUrl: ''
                            });
                        }}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        + Добавить товар
                    </button>
                </div>
            </div>

            {/* Форма создания/редактирования */}
            {showForm && (
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            {editingProduct ? '✏️ Редактирование товара' : '➕ Создание товара'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕ Закрыть
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Название *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                                    placeholder="Например: Жидкость 'Мятная свежесть'"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Категория *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 resize-none"
                                placeholder="Подробное описание товара..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Цена (₽) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                                    placeholder="499.99"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Количество *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                                    placeholder="10"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Ссылка на изображение</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingProduct(null);
                                }}
                                className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Отмена
                            </button>

                            <button
                                type="submit"
                                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                {editingProduct ? 'Сохранить изменения' : 'Создать товар'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => loadProducts()}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold mb-2">Товаров пока нет</h2>
                    <p className="text-gray-400">Добавьте первый товар</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium mb-2 inline-block ${
                      product.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2">Категория: {product.category}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white mb-1">{product.price} ₽</div>
                                    <div className="text-gray-400 text-sm">Остаток: {product.stock} шт</div>
                                </div>
                            </div>

                            {product.description && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                            )}

                            {product.imageUrl && (
                                <div className="mb-4">
                                    <div className="w-full h-40 bg-dark-700 rounded-lg overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">🖼️</div>';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm"
                                >
                                    Редактировать
                                </button>

                                <button
                                    onClick={() => handleToggleActive(product)}
                                    className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                                        product.isActive
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {product.isActive ? 'Деактивировать' : 'Активировать'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;