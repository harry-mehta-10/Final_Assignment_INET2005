import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css';

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); 
    setTimeout(() => {
      navigate('/login'); 
    }, 1500); 
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="logout-container">
      <div className="logout-message">
        <h2>You have been logged out.</h2>
        <p>Redirecting to the login page...</p>
      </div>
    </div>
  );
};

export default Logout;
