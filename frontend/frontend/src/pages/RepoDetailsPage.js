import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/RepoDetailsPage.css';

const RepoDetailsPage = () => {
  const { repoName } = useParams();

  const sampleFiles = ['index.html', 'main.css', 'app.js', 'README.md'];

  return (
    <div className="repo-details-page">
      <h1>Repository: {repoName}</h1>
      <ul>
        {sampleFiles.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default RepoDetailsPage;
