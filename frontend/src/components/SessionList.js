import React from 'react';
import { Link } from 'react-router-dom';

const SessionList = ({ sessions }) => {
  return (
    <div>
      <h2>Previous Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.sessionId}>
            <Link to={`/chat/${session.sessionId}`}>
              Session ID: {session.sessionId} - Started at: {new Date(session.start).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
