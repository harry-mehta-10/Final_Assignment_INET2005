import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie'; 
import './product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();  
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`http://localhost:5000/images/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="text-primary">{product.name}</h2>
          <p className="text-muted">${product.cost.toFixed(2)}</p>
          <p>{product.description}</p>

          <button onClick={handleAddToCart} className="btn btn-primary mt-3 btn-lg">
            Add to Cart
          </button>
          <button onClick={handleGoBack} className="btn btn-secondary mt-3 ms-2 btn-lg">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
