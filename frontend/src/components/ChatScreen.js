import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ChatScreen.css';

const ChatScreen = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/session/${sessionId}/question`);
        const data = await response.json();

        setMessages([{ type: 'question', text: data.question }]);
      } catch (error) {
        console.error('Error fetching initial question:', error);
      }
    };

    fetchInitialQuestion();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'answer', text: userInput }
    ]);

    try {
      const response = await fetch(`http://localhost:3001/api/session/${sessionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: userInput }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'question', text: data.question }
      ]);

      setUserInput('');
    } catch (error) {
      console.error('Error sending answer:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.type === 'question' ? 'question' : 'answer'}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer..."
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
