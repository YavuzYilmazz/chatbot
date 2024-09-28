import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './components/Chat';
import SessionStart from './components/SessionStart';
import SessionList from './components/SessionList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SessionStart />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/chat/:sessionId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
