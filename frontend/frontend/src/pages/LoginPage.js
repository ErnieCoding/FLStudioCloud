import React, { useState } from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        window.location.href = 'RepositoriesPage.js'; // Redirect on success
      } else {
        const data = await response.json();
        setError(data.message); // Display error message
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          <button type="submit">Sign in</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p><a href="#">Create an account</a>.</p>
      </main>
    </div>
  );
};

export default LoginPage;
