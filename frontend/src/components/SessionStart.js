import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SessionStart = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/sessions'); // Updated to port 3001
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error.response ? error.response.data : error.message);
        }
    };

    const startNewSession = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/sessions', {
            });
            navigate(`/chat/${response.data.id}`);
        } catch (error) {
            console.error('Error starting new session:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return (
        <div>
            <h1>Start a Session</h1>
            <button onClick={startNewSession}>Start New Session</button>
            <h2>Previous Sessions</h2>
            <ul>
                {sessions.map((session) => (
                    <li key={session.id} onClick={() => navigate(`/chat/${session.id}`)}>
                        {session.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SessionStart;
