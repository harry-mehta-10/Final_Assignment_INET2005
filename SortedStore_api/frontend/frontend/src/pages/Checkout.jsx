import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  return (
    <div>
      <h1>Checkout Page</h1>
      <p>This is the checkout page. Here, the user will review their order and complete the purchase.</p>
      
      <div className="checkout-actions">
        <Link to="/cart" className="back-to-cart">
          Go Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
