# Chatbot Application

## Overview
This project is a full-stack application built using MongoDB, Express.js, React.js, and Node.js (MERN stack). The application allows users to create sessions, answer predefined questions, and retrieve session data.

## Project Structure

- `backend/`: Express.js and MongoDB for the server-side functionality
- `frontend/`: React.js for the client-side functionality


## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Styling**: CSS

## Prerequisites
- Node.js and npm installed.
- MongoDB running locally or a MongoDB Atlas account.
- Knowledge of JavaScript, React, Node.js, and MongoDB.

## Installation & Setup

Clone the repository:
```bash
git clone https://github.com/YavuzYilmazz/chatbot.git
cd backend
```

change .env file

MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=3001


after that run the following commands:
```bash
npm install
node index.js
```

Open a new terminal and run the following commands:

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint                           | Description                            |
|--------|------------------------------------|----------------------------------------|
| GET    | /api/sessions                      | Retrieve all sessions                  |
| POST   | /api/session                       | Start a new session                    |
| POST   | /api/session/:sessionId/answer     | Save the user's answer for a session   |
| GET    | /api/session/:sessionId/messages   | Retrieve all messages for a session    |
| GET    | /api/session/:sessionId/question   | Get the current question for a session |
| GET    | /api/session/:sessionId/answers    | Get all answers for a session          |
| DELETE | /api/session/:sessionId            | Delete a session                       |
| DELETE | /api/sessions                      | Delete all sessions                    |


## Contact
If you have any questions or need help with the setup, feel free to reach out to me at [`yavuz.yilmaz1@outlook.com`].

## Help Video
You can watch this video https://www.youtube.com/watch?v=IoWxcuHSMxA