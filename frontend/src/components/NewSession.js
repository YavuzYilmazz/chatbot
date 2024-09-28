import React, { useState } from 'react';
import axios from 'axios';

const NewSession = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/sessions', { title });
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <div>
      <h1>Create New Session</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Create Session</button>
      </form>
    </div>
  );
};

export default NewSession;
