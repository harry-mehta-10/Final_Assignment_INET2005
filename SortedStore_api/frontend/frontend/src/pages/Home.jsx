import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to SortedStore</h1>
        <p>Your one-stop shop for everything you need, delivered at lightning speed!</p>
        <Link to="/cart" className="btn-hero">Shop Now</Link>
      </header>

      <h2 className="section-title">Our Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img
              src={`http://localhost:5000/images/${product.image}`}
              alt={product.name}
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text text-muted">${product.cost.toFixed(2)}</p>
              <Link to={`/product/${product.id}`} className="btn-custom">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
