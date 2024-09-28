import React from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { sessionId } = useParams();

  return (
    <div>
      <h1>Chat for Session: {sessionId}</h1>
      {/* Implement chat functionality here */}
    </div>
  );
};

export default Chat;
