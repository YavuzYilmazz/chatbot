import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SessionStart = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sessions'); // Adjust the URL if needed
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Existing Sessions</h1>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            <Link to={`/session/${session._id}`}>{session.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/new-session">Create New Session</Link>
    </div>
  );
};

export default SessionStart;
