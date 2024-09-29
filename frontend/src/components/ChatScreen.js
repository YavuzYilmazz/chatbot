import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ChatScreen.css';

const ChatScreen = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isNew, setIsNew] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessionMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/session/${sessionId}/messages`);
      if (!response.ok) {
        throw new Error('Error fetching messages');
      }
      const data = await response.json();

      setMessages(data.messages);

      if (data.messages.length === 0) {
        const questionResponse = await fetch(`http://localhost:3001/api/session/${sessionId}/question`);
        const questionData = await questionResponse.json();
        setMessages([{ question: questionData.question, answer: '' }]);
      }

      const lastMessage = data.messages[data.messages.length - 1];
      if (lastMessage && lastMessage.answer&&!isNew) {
        fetchNextQuestion();
      }
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      setIsNew(true);
      const response = await fetch(`http://localhost:3001/api/session/${sessionId}/question`);
      const data = await response.json();

      if (!messages.some((message) => message.question === data.question)) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { question: data.question, answer: '' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  useEffect(() => {
    fetchSessionMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isNew]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { question: '', answer: userInput }
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

      if (data.question) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { question: data.question, answer: '' }
        ]);
      }

      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index}>
            {message.question && (
              <div className="chat-message question">
                <strong>Bot:</strong> {message.question}
              </div>
            )}
            {message.answer && (
              <div className="chat-message answer">
                <strong>You:</strong> {message.answer}
              </div>
            )}
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
