import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import './checkout.css';

const CheckoutPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    credit_card: "",
    credit_expire: "",
    credit_cvv: "",
  });
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      const productIds = decodeURIComponent(cartCookie).split(",").filter((id) => id);
      fetchCartProducts(productIds);
    }
  }, []);

  const fetchCartProducts = async (productIds) => {
    try {
      const productPromises = productIds.map((id) =>
        axios.get(`http://localhost:5000/products/${id}`)
      );
      const responses = await Promise.all(productPromises);
      const products = responses.map((res) => res.data);

      const productQuantities = productIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const formattedCart = Object.entries(productQuantities).map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity
      }));

      setCart(formattedCart);
    } catch (err) {
      console.error("Error fetching cart products:", err);
      setError("Failed to load cart products.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(form).every((value) => value.trim())) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/complete-purchase", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}` 
        },
        body: JSON.stringify({ ...form, cart }),
      });

      const data = await response.json();
      if (response.ok) {
        Cookies.remove("cart");
        navigate("/confirmation");
      } else {
        alert(data.error || "Purchase failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p>Please <a href="/login?redirect=/checkout" className="text-blue-600">login</a> to proceed to checkout.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2 className="checkout-title">Complete Your Purchase</h2>
        {["street", "city", "province", "country", "postal_code", "credit_card", "credit_expire", "credit_cvv"].map((field) => (
          <div className="form-group" key={field}>
            <input
              type="text"
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        ))}
        <button type="submit" className="submit-btn">Complete Purchase</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
