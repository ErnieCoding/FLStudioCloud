import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // Parse JSON once
      console.log('Response status:', response.status);
      console.log('Response body:', data);

      if (response.ok) {
        // Save tokens to localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log('Login successful!');
        window.location.href = '/repositories'; // Redirect to repositories
      } else {
        setError(data.detail || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Welcome to FLCloud</h1>
        <p>Create Your Best Music, Together</p>
      </header>
      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or email address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
