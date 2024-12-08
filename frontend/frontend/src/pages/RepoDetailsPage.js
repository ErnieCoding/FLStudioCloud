import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaFileAudio, FaFileImage, FaFileCode, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import AccountDropdown from '../components/AccountDropdown';
import BackButton from '../components/BackButton';
import '../styles/RepoDetailsPage.css';
import { fetchWithAuth } from '../utils/apiUtils';

const BASE_URL = 'http://ec2-54-82-5-168.compute-1.amazonaws.com';

const RepoDetailsPage = () => {
  const { repoName: repoId } = useParams();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [repository, setRepository] = useState(null); // Holds repository details
  const [error, setError] = useState(null);

  // Fetch repository details and files
  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        // Fetch repository details
        const repoResponse = await fetchWithAuth(`${BASE_URL}/api/repositories/${repoId}/`);
        if (repoResponse.ok) {
          const repoData = await repoResponse.json();
          setRepository(repoData);
        } else {
          const repoErrorData = await repoResponse.json();
          setError(repoErrorData.message || 'Failed to fetch repository details.');
        }

        // Fetch files for the repository
        const filesResponse = await fetchWithAuth(`${BASE_URL}/api/repositories/${repoId}/files/`);
        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setFiles(filesData.files);
        } else {
          const filesErrorData = await filesResponse.json();
          setError(filesErrorData.message || 'Failed to fetch files.');
        }
      } catch (err) {
        console.error('Error fetching repository details or files:', err);
        setError('Something went wrong. Please try again.');
      }
    };

    fetchRepositoryDetails();
  }, [repoId]);

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
      case 'py':
      case 'h':
      case 'c':
      case 'cpp':
        return <FaFileCode className="file-icon" />;
      case 'pdf':
        return <FaFilePdf className="file-icon" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const formData = new FormData();
    const newFiles = Array.from(event.target.files);

    newFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/repositories/${repoId}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploaded = await response.json();
        setFiles((prevFiles) => [...prevFiles, ...uploaded.files]);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload files.');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="repo-details-page">
      <header>
        <AccountDropdown />
        <h1>Repository: {repository ? repository.title : 'Loading...'}</h1>
      </header>
      <main>
        <BackButton />
        <div className="upload-section">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="file-upload"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={`file-${index}`}>
              {getFileIcon(file.file_name)}
              <span className="file-name">{file.file_name}</span>
            </li>
          ))}
          {uploadedFiles.map((file, index) => (
            <li key={`uploaded-${index}`}>
              {getFileIcon(file.name)}
              <span className="file-name">{file.name}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default RepoDetailsPage;
