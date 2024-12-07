import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepoDetailsPage from './pages/RepoDetailsPage';
import SignUpPage from './pages/SignUpPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/repositories/:repoName" element={<RepoDetailsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
