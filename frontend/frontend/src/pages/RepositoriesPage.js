import React from 'react';
import RepoCard from '../components/RepoCard';
import '../styles/RepositoriesPage.css';

const RepositoriesPage = () => {
  const sampleRepos = [
    { name: 'React-App', description: 'React-based frontend app' },
    { name: 'Django-API', description: 'Django REST API backend' },
    { name: 'DevOps-Scripts', description: 'Automation scripts for CI/CD' },
  ];

  return (
    <div className="repositories-page">
      <header>
        <h1>Your Repositories</h1>
      </header>
      <main>
        {sampleRepos.map((repo, index) => (
          <RepoCard key={index} repo={repo} />
        ))}
      </main>
    </div>
  );
};

export default RepositoriesPage;
