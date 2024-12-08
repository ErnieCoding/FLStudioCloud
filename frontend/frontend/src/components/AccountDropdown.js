// components/AccountDropdown.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountDropdown = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div className="account-dropdown">
      <button className="account-icon">👤</button>
      <div className="dropdown-menu">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AccountDropdown;
