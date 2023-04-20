import React, { useState, useEffect } from 'react';
import './styles.css';

const FileUploader = () => {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [custodianValue, setCustodianValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    uploadQueueF();
  }, [uploadQueue, uploadQueueF]);

  const dropInFiles = (e) => {
    e.preventDefault();
    const uploadedFiles = Array.from(e.dataTransfer.files);
    setFilesToUpload([...filesToUpload, ...uploadedFiles]);
  };

  const fileBrowseUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFilesToUpload([...filesToUpload, ...uploadedFiles]);
  };

  const custodianInput = (e) => {
    const custodianValue = e.target.value;
    if (custodianValue.length < 3) {
      setError('The custodian must be 3 characters or more.');
      setCustodianValue(custodianValue);
    } else {
      setError('');
      setCustodianValue(custodianValue);
    }
  };

  const handleSubmit = () => {
    if (!custodianValue) {
      setError('Please enter a custodian name');
      return;
    }
    if (filesToUpload.length === 0) {
      setError('Please select at least one file');
      return;
    }
    setUploadQueue([...uploadQueue, { filesToUpload, custodianValue }]);
    setFilesToUpload([]);
    setCustodianValue('');
    setError('');
  };

  const uploadQueueF = () => {
    if (uploadQueue.length > 0 && !uploading) {
      setUploading(true);
      let counter = 0;
      const countingUp = setInterval(() => {
        if (counter < 100) {
          setProgressBar(counter);
          counter += 10;
        } else {
          setProgressBar(0);
          setUploadQueue(uploadQueue.slice(1));
          setUploading(false);
          clearInterval(countingUp);
        }
      }, 1000);
    }
  };

  return (
    <div
      className='main-box'
      onDrop={dropInFiles}
      onDragOver={(e) => e.preventDefault()}
    >
      {uploading ? (
        <div className='content-box'>
          <div>
            <h1>
              Drap and Drop or click the Browse button to choose which files you
              want to upload!
            </h1>
            {filesToUpload.length > 0 ? (
              <div className='custodian-box'>
                <h2>Enter Custodian:</h2>
                <input
                  className='custodian-input'
                  type='text'
                  value={custodianValue}
                  onChange={custodianInput}
                />
                {error && <p className='error'>{error}</p>}
                <button
                  className='upload-button submit-button'
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div>
                <input
                  className='hidden'
                  id='files'
                  type='file'
                  onChange={fileBrowseUpload}
                  multiple
                />
                <label className='upload-button' htmlFor='files'>
                  Select files
                </label>
              </div>
            )}
          </div>
          <div className='uploading-box'>
            <h2>Uploading Files...</h2>
            {uploadQueue.length > 0 && (
              <div>
                <h3>Upload Queue:</h3>
                {uploadQueue.map(({ filesToUpload, custodianValue }, i) => (
                  <div key={i}>
                    <p>Custodian: {custodianValue}</p>
                    <p>Files: {filesToUpload.length}</p>
                  </div>
                ))}
              </div>
            )}
            <div className='progress-bar-outline'>
              <progress value={progressBar} max='100' />
            </div>
          </div>
        </div>
      ) : (
        <div className='content-box'>
          <h1>
            Drap and Drop or click the Browse button to choose which files you
            want to upload!
          </h1>
          {filesToUpload.length > 0 ? (
            <div className='custodian-box'>
              <h3>Enter Custodian:</h3>
              <input
                className='custodian-input'
                type='text'
                value={custodianValue}
                onChange={custodianInput}
              />
              {error && <p className='error'>{error}</p>}
              <button
                className='upload-button submit-button'
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          ) : (
            <div>
              <input
                className='hidden'
                id='files'
                type='file'
                onChange={fileBrowseUpload}
                multiple
              />
              <label className='upload-button' htmlFor='files'>
                Select files
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
