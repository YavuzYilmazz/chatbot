import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SessionList from './components/SessionList';
import NewSession from './components/NewSession';
import Chat from './components/Chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SessionList />} />
        <Route path="/new-session" element={<NewSession />} />
        <Route path="/chat/:sessionId" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
