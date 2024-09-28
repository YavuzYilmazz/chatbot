import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { sessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/sessions/${sessionId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        }
    };

    const sendMessage = async () => {
        try {
            await axios.post(`http://localhost:3001/api/sessions/${sessionId}/messages`, { text: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [sessionId]);

    return (
        <div>
            <h1>Chat Session: {sessionId}</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message.text}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
