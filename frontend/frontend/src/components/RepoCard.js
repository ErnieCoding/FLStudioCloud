import React from 'react';

const RepoCard = ({ repo }) => {
  const handleOpenRepo = () => {
    window.location.href = `/repositories/${repo.id}`; // Redirect based on repo ID
  };

  return (
    <div className="repo-card" onClick={handleOpenRepo}>
      <h2>{repo.title}</h2> {/* Display title from the backend */}
      <p>{repo.description}</p> {/* Display description */}
    </div>
  );
};

export default RepoCard;
