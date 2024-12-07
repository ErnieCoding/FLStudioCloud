import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFileAudio, FaFileImage, FaFileCode, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import '../styles/RepoDetailsPage.css';

const RepoDetailsPage = () => {
  const { repoName } = useParams();

  // Preexisting files in the repository
  const predefinedFiles = ['index.html', 'main.css', 'app.js', 'README.md'];

  // Local state to track uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // File type mapping (icons based on file type)
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FaFileAudio className="file-icon" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FaFileImage className="file-icon" />;
      case 'html':
      case 'css':
      case 'js':
      case 'jsx':
        return <FaFileCode className="file-icon" />;
      case 'pdf':
        return <FaFilePdf className="file-icon" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  // Handle file upload (adds file to local state)
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => file.name);
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <div className="repo-details-page">
      <h1>Repository: {repoName}</h1>

      {/* File upload section */}
      <div className="upload-section">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="file-upload"
        />
      </div>

      {/* File list section */}
      <ul className="file-list">
        {/* Render preexisting files in the repository */}
        {predefinedFiles.map((file, index) => (
          <li key={`predefined-${index}`}>
            {getFileIcon(file)}
            <span className="file-name">{file}</span>
          </li>
        ))}

        {/* Render uploaded files */}
        {uploadedFiles.map((file, index) => (
          <li key={`uploaded-${index}`}>
            {getFileIcon(file)}
            <span className="file-name">{file}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoDetailsPage;
