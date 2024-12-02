import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <div>
        <img
          src={`http://localhost:5000/images/${product.image}`} 
          alt={product.name}
          style={{ width: '300px', height: 'auto' }}
        />
      </div>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
};

export default ProductPage;
