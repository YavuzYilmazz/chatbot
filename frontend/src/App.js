import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SessionList from './components/SessionList';
import ChatScreen from './components/ChatScreen';
import './App.css';

const App = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sessions');
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <Router>
      <div>
        <h1>Welcome to Chatbot</h1>
        <Routes>
          <Route path="/" element={<Home sessions={sessions} />} />
          <Route path="/chat/:sessionId" element={<ChatScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = ({ sessions }) => {
  const navigate = useNavigate();

  const startNewSession = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={startNewSession} className="start-session-button">
          Start New Session
        </button>
      </div>
      <SessionList sessions={sessions} />
    </div>
  );
};

export default App;
