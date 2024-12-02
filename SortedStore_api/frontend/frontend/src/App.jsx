import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart'; 
import CheckoutPage from './pages/Checkout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
