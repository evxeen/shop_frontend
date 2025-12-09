// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';

// Основные страницы
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TelegramAuthPage from './pages/TelegramAuthPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

// Админские страницы
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Админские роуты (без общего Layout) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                <Route path="/admin/orders" element={<Layout><AdminOrdersPage /></Layout>} />
                <Route path="/admin/products" element={<Layout><AdminProductsPage /></Layout>} />
                <Route path="/admin/users" element={<Layout><AdminUsersPage /></Layout>} />

                {/* Основные роуты */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
                <Route path="/telegram-auth" element={<Layout><TelegramAuthPage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;