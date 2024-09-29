import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SessionList.css';

const SessionList = ({ sessions }) => {
  return (
    <div className="session-list-container">
      <h2>Previous Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.sessionId} className="session-item">
            <Link to={`/chat/${session.sessionId}`} className="session-link">
              <div className="session-info">
                <span>{session.title}</span>
                <span className="session-date">
                  {new Date(session.start).toLocaleString()}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
