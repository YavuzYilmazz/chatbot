import React, { useEffect, useState } from 'react';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sessions'); // Adjust port if needed
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Session List</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.sessionId}>
            Session ID: {session.sessionId}
            <ul>
              {session.questions.map((q, index) => (
                <li key={index}>{q.question}: {q.answer}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
