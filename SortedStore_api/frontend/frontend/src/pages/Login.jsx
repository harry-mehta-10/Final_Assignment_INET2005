import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/checkout';

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('authToken', responseData.token);
        navigate(redirectTo);
      } else {
        setLoginError('Invalid email or password.');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {loginError && <p className="error">{loginError}</p>}

        <button type="submit">Sign In</button>
      </form>
      <p className="signup-link">
        New to our store? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
