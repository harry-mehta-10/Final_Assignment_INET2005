import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      });
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Welcome to SortedStore</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded">
              <img
                src={`http://localhost:5000/images/${product.image}`}
                alt={product.name}
                className="card-img-top"
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">${product.cost.toFixed(2)}</p>
                <Link to={`/product/${product.id}`} className="btn btn-custom btn-block">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
