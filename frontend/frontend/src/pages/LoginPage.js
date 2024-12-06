import React from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = '/repositories';
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Welcome to FLStudio</h1>
        <p>Create Your Best Music.</p>
      </header>
      <main className="login-main">
        <form className="login-form">
          <input type="text" placeholder="Username or email address" required />
          <input type="password" placeholder="Password" required />
          <button type="button" onClick={handleLogin}>
            Sign in
          </button>
        </form>
        <p><a href="#">Create an account</a>.</p>
      </main>
    </div>
  );
};

export default LoginPage;
