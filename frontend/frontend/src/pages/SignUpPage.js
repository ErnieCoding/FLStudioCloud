import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message); // Display success message
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message); // Display backend error message
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <h1>Join FLCloud</h1>
        <p>Start Creating and Collaborating</p>
      </header>
      <main className="signup-main">
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </main>
    </div>
  );
};

export default SignUpPage;
