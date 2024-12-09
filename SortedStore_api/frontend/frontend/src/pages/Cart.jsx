import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import './cart.css';

const TAX_RATE = 0.15;

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuantity, setCartQuantity] = useState({});
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      const productIds = decodeURIComponent(cartCookie).split(",").filter((id) => id);
      fetchProducts(productIds);
    }
  }, []);

  const fetchProducts = async (productIds) => {
    try {
      const productPromises = productIds.map((id) =>
        axios.get(`http://localhost:5000/products/${id}`)
      );
      const responses = await Promise.all(productPromises);
      const products = responses.map((res) => res.data);

      setCartProducts(products);

      const quantityMap = productIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});
      setCartQuantity(quantityMap);

      calculateTotals(products, quantityMap);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load cart products");
    }
  };

  const updateCartCookie = (updatedCart) => {
    if (updatedCart.length === 0) {
      Cookies.remove("cart");
    } else {
      Cookies.set("cart", encodeURIComponent(updatedCart.join(",")), { expires: 7 });
    }
  };

  const removeFromCart = async (productId) => {
    const cartCookie = Cookies.get("cart") || "";
    const productIds = decodeURIComponent(cartCookie).split(",").filter((id) => id);

    try {
      const response = await axios.post("http://localhost:5000/cart/remove", {
        productId,
        cart: productIds,
      });
      const updatedCart = response.data.updatedCart;
      updateCartCookie(updatedCart);

      const updatedQuantity = { ...cartQuantity };
      if (updatedQuantity[productId] > 1) {
        updatedQuantity[productId]--;
      } else {
        delete updatedQuantity[productId];
      }

      const filteredProducts = cartProducts.filter(
        (product) => updatedQuantity[product.id]
      );

      setCartQuantity(updatedQuantity);
      setCartProducts(filteredProducts);

      calculateTotals(filteredProducts, updatedQuantity);
    } catch (error) {
      console.error("Error removing product:", error);
      setError("Failed to remove product from cart");
    }
  };

  const clearCart = () => {
    setCartProducts([]);
    setCartQuantity({});
    setTotals({ subtotal: 0, tax: 0, total: 0 });
    Cookies.remove("cart");
  };

  const calculateTotals = (products, quantityMap) => {
    const subtotal = products.reduce((total, product) => {
      const quantity = quantityMap[product.id] || 0;
      return total + product.cost * quantity;
    }, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    setTotals({ subtotal, tax, total });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cartProducts.map((product) => {
          const quantity = cartQuantity[product.id] || 0;
          const total = product.cost * quantity;

          return (
            <div key={product.id} className="cart-item">
              <img
                src={`http://localhost:5000/images/${product.image}`}
                alt={product.name}
              />
              <div className="details">
                <h4>{product.name}</h4>
                <p>${product.cost.toFixed(2)}</p>
                <p>Quantity: {quantity}</p>
                <p>Total: ${total.toFixed(2)}</p>
              </div>
              <div className="actions">
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Subtotal: ${totals.subtotal.toFixed(2)}</h3>
        <h3>Tax: ${totals.tax.toFixed(2)}</h3>
        <h3>Total: ${totals.total.toFixed(2)}</h3>
      </div>

      <div className="cart-actions">
        <Link to="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn btn-primary">
          Complete Purchase
        </Link>
        <button className="btn btn-danger" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
