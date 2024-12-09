import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Nav from "./ui/Nav"; 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Confirmation from "./pages/Confirmation";


// API call for login
const loginAPI = async (credentials) => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false };
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async (credentials) => {
    const response = await loginAPI(credentials);
    if (response.success) {
      localStorage.setItem("authToken", response.token);
      setIsLoggedIn(true);

      const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectTo);
    } else {
      alert("Login failed");
    }
  };

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={isLoggedIn ? <CheckoutPage /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </>
  );
};

export default App;
