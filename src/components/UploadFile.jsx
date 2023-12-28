import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDataChange = (event) => {
    setData(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', data);

    try {
      const response = await axios.post('http://localhost:3081/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File upload response:', response.data);
    } catch (error) {
      console.error('Error uploading file and data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="otsMainPages">
        <label htmlFor="file">Choose File:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="data">Data:</label>
        <input type="text" id="data" value={data} onChange={handleDataChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadFile;
