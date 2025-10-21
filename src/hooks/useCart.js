// src/hooks/useCart.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity = 1) => {
                const { items } = get();
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    set({
                        items: [...items, { ...product, quantity }]
                    });
                }
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter(item => item.id !== productId)
                });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set({
                    items: get().items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => {
                const { items } = get();
                return items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },
            getTotalItems: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'vape-shop-cart',
        }
    )
);

export default useCart;