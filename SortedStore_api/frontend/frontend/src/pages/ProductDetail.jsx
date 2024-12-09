import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const sampleDetails = {
    material: '100% Cotton',
    careInstructions: 'Machine wash cold, tumble dry low',
    brand: 'Generic Brand',
    sizes: ['S', 'M', 'L', 'XL'], 
  };

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
      });
  }, [id]);

  const handleAddToCart = () => {
    const cartCookie = Cookies.get('cart') || '';
    const updatedCart = cartCookie ? `${cartCookie},${product.id}` : `${product.id}`;

    Cookies.set('cart', updatedCart, { expires: 7 });

    alert(`${product.name} has been added to your cart!`);

    navigate('/cart');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-info">Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image">
          <img
            src={`http://localhost:5000/images/${product.image}`}
            alt={product.name}
            className="product-img"
          />
        </div>
        <div className="product-info">
          <h2 className="product-title">{product.name}</h2>
          <div className="product-rating">
            <span className="star-rating">⭐⭐⭐⭐☆</span>
            <span className="reviews-count">({product.reviewsCount || 100} reviews)</span>
          </div>
          <p className="product-price">${product.cost.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <button onClick={handleAddToCart} className="btn-primary">Add to Cart</button>
            <button onClick={handleGoBack} className="btn-secondary">Go Back</button>
          </div>

          <div className="product-shipping">
            <p><strong>Free Shipping</strong> on orders over $50.</p>
          </div>
        </div>
      </div>

      <div className="additional-details">
        <div className="shipping-info">
          <h3>Product Details</h3>
          <ul>
            <li>Material: {product.material || sampleDetails.material}</li>
            <li>Care Instructions: {product.careInstructions || sampleDetails.careInstructions}</li>
            <li>Brand: {product.brand || sampleDetails.brand}</li>
            <li>Available Sizes: {product.sizes?.join(', ') || sampleDetails.sizes.join(', ')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
