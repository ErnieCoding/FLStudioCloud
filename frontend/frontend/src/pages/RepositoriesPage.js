import React, { useState, useEffect } from 'react';
import RepoCard from '../components/RepoCard';
import AccountDropdown from '../components/AccountDropdown';
import BackButton from '../components/BackButton';
import '../styles/RepositoriesPage.css';
import { fetchWithAuth } from '../utils/apiUtils';

const BASE_URL = 'http://ec2-54-82-5-168.compute-1.amazonaws.com';

const RepositoriesPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [error, setError] = useState(null);

  // Fetch repositories for the logged-in user
  useEffect(() => {
    const fetchRepositories = async () => {
      setError(null); // Clear any previous error
      try {
        const response = await fetchWithAuth(`${BASE_URL}/api/repositories/`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setRepositories(data.repositories);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch repositories.');
        }
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError('Something went wrong. Please try again.');
      }
    };

    fetchRepositories();
  }, []);

  // Handle creating a new repository
  const handleCreateRepo = async () => {
    setError(null); // Clear previous error
    if (newRepoName.trim() && newRepoDescription.trim()) {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/api/repositories/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newRepoName,
            description: newRepoDescription,
          }),
        });
  
        if (response.ok) {
          const newRepo = await response.json();
          setRepositories([...repositories, newRepo]);
          setNewRepoName('');
          setNewRepoDescription('');
        } else {
          const errorData = await response.json();
          console.error('Error creating repository:', errorData);
          setError(errorData.detail || 'Failed to create repository.');
        }
      } catch (err) {
        console.error('Error creating repository:', err);
        setError('Something went wrong. Please try again.');
      }
    } else {
      setError('Repository name and description are required.');
    }
  };

  return (
    <div className="repositories-page">
      <header>
        <AccountDropdown />
        <h1>Your Repositories</h1>
      </header>
      <main>
        <BackButton />
        {error && <p className="error">{error}</p>}
        {repositories.length === 0 ? (
          <p>No repositories found.</p>
        ) : (
          repositories.map((repo) => <RepoCard key={repo.id} repo={repo} />)
        )}
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
