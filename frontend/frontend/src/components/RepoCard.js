import React from 'react';

const RepoCard = ({ repo }) => {
  const handleOpenRepo = () => {
    window.location.href = `/repositories/${repo.name}`;
  };

  return (
    <div className="repo-card" onClick={handleOpenRepo}>
      <h2>{repo.name}</h2>
      <p>{repo.description}</p>
    </div>
  );
};

export default RepoCard;
