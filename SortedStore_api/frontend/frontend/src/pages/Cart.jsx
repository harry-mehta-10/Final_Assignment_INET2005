import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuantity, setCartQuantity] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const cartCookie = Cookies.get('cart');

    if (cartCookie) {
      const productIds = cartCookie.split(',').filter(id => id);
      fetchProducts(productIds);
    }
  }, []);

  const fetchProducts = async (productIds) => {
    try {
      const productPromises = productIds.map(id =>
        fetch(`http://localhost:5000/products/${id}`).then(response => response.json())
      );
      const products = await Promise.all(productPromises);

      setCartProducts(products);

      const quantityMap = productIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});
      setCartQuantity(quantityMap);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load cart products');
    }
  };

  const removeFromCart = (productId) => {
    const cartCookie = Cookies.get('cart') || '';
    const productIds = cartCookie.split(',').filter(id => id);
    const updatedCart = productIds.filter(id => id !== productId.toString());
    Cookies.set('cart', updatedCart.join(','), { expires: 7 });

    const updatedQuantity = { ...cartQuantity };
    if (updatedQuantity[productId] > 1) {
      updatedQuantity[productId]--;
    } else {
      delete updatedQuantity[productId];
    }

    setCartQuantity(updatedQuantity);
    setCartProducts(cartProducts.filter(product => updatedQuantity[product.id]));
  };

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, product) => {
      const quantity = cartQuantity[product.id] || 0;
      return total + (product.cost * quantity);
    }, 0);
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
                <p className="quantity">Quantity: {quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(product.id)}>
                  Remove One
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Subtotal: ${calculateSubtotal().toFixed(2)}</h3>
      </div>

      <div className="cart-actions">
        <Link to="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn btn-primary">
          Complete Purchase
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
