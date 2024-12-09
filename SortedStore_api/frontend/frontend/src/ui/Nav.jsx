import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const calculateCartCountFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    setCartCount(count);
  };

  const fetchCartCountFromBackend = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.cartCount);
        }
      } catch (error) {
        console.error('Failed to fetch cart count from backend:', error);
      }
    } else {
      calculateCartCountFromLocalStorage();  
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    fetchCartCountFromBackend();

    const handleStorageChange = (event) => {
      if (event.key === 'cart') {
        calculateCartCountFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    window.addEventListener('cart-updated', fetchCartCountFromBackend);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', fetchCartCountFromBackend);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SortedStore
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/cart" className="navbar-link cart-link">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/checkout" className="navbar-link">Checkout</Link>
              <Link to="/logout" className="navbar-link" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <Link to="/login?redirect=checkout" className="navbar-link">Checkout</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
