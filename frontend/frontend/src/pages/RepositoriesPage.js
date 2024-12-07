import React, { useState } from 'react';
import RepoCard from '../components/RepoCard';
import '../styles/RepositoriesPage.css';

const RepositoriesPage = () => {
  const [repositories, setRepositories] = useState([
    { name: 'React-App', description: 'React-based frontend app' },
    { name: 'Django-API', description: 'Django REST API backend' },
    { name: 'DevOps-Scripts', description: 'Automation scripts for CI/CD' },
  ]);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');

  const handleCreateRepo = () => {
    if (newRepoName.trim() && newRepoDescription.trim()) {
      setRepositories([
        ...repositories,
        { name: newRepoName, description: newRepoDescription },
      ]);
      setNewRepoName('');
      setNewRepoDescription('');
    }
  };

  return (
    <div className="repositories-page">
      <header>
        <h1>Your Repositories</h1>
      </header>
      <main>
        {repositories.map((repo, index) => (
          <RepoCard key={index} repo={repo} />
        ))}
      </main>
      <div className="create-repo">
        <h2>Create New Repository</h2>
        <input
          type="text"
          placeholder="Repository Name"
          value={newRepoName}
          onChange={(e) => setNewRepoName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repository Description"
          value={newRepoDescription}
          onChange={(e) => setNewRepoDescription(e.target.value)}
        />
        <button onClick={handleCreateRepo}>Create Repository</button>
      </div>
    </div>
  );
};

export default RepositoriesPage;
