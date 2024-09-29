const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const multer = require('multer');

const upload = multer();
const router = express.Router();

const questions = [
  "What is your favorite breed of cat, and why?",
  "How do you think cats communicate with their owners?",
  "Have you ever owned a cat? If so, what was their name and personality like?",
  "Why do you think cats love to sleep in small, cozy places?",
  "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
  "Do you prefer cats or kittens, and what’s the reason for your preference?",
  "Why do you think cats are known for being independent animals?",
  "How do you think cats manage to land on their feet when they fall?",
  "What’s your favorite fact or myth about cats?",
  "How would you describe the relationship between humans and cats in three words?"
];

/**
 * GET /sessions
 * Fetches all existing sessions from the database.
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
});

/**
 * POST /session
 * Starts a new session, generates a session ID, stores it in the database,
 * and returns the first question.
 */
router.post('/session', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = new Session({
      sessionId,
      questions: [],
      currentQuestionIndex: 0,
      start: Date.now()
    });
    
    await session.save();

    res.status(201).json({ sessionId, question: questions[0] }); 
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Error creating session', error });
  }
});

/**
 * POST /session/:sessionId/answer
 * Saves the user's answer to the current question in the session, 
 * and returns the next question if available.
 */
router.post('/session/:sessionId/answer', upload.none(), async (req, res) => {
  const { sessionId } = req.params;
  const { answer } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.currentQuestionIndex < questions.length) {
      const currentQuestion = questions[session.currentQuestionIndex];

      if (!session.questions.some(q => q.question === currentQuestion)) {
        session.questions.push({ question: currentQuestion, answer: '' });
      }

      const questionToUpdate = session.questions.find(q => q.question === currentQuestion);
      questionToUpdate.answer = answer;

      session.currentQuestionIndex++;
      await session.save();

      if (session.currentQuestionIndex < questions.length) {
        res.status(200).json({
          message: 'Answer saved',
          question: questions[session.currentQuestionIndex],
        });
      } else {
        session.end = Date.now();
        await session.save();
        res.status(200).json({
          message: 'All questions answered',
          session
        });
      }
    } else {
      res.status(400).json({ message: 'No more questions available.' });
    }
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ message: 'Error saving answer', error });
  }
});

/**
 * GET /session/:sessionId/messages
 * Retrieves all messages (questions and answers) for a specific session.
 */
router.get('/session/:sessionId/messages', async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const session = await Session.findOne({ sessionId });
        
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = session.questions;

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

module.exports = router;

/**
 * GET /session/:sessionId/question
 * Retrieves the current question for the specified session.
 */
router.get('/session/:sessionId/question', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.currentQuestionIndex < questions.length) {
      res.status(200).json({ question: questions[session.currentQuestionIndex] });
    } else {
      res.status(200).json({ message: 'All questions answered' });
    }
  } catch (error) {
    console.error('Error retrieving question:', error);
    res.status(500).json({ message: 'Error retrieving question', error });
  }
});

/**
 * GET /session/:sessionId/answers
 * Retrieves all answers for the specified session.
 */
router.get('/session/:sessionId/answers', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session.questions);
  } catch (error) {
    console.error('Error retrieving answers:', error);
    res.status(500).json({ message: 'Error retrieving answers', error });
  }
});

/**
 * DELETE /session/:sessionId
 * Deletes a specific session by its session ID.
 */
router.delete('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOneAndDelete({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Error deleting session', error });
  }
});

/**
 * DELETE /sessions
 * Deletes all sessions from the database.
 */
router.delete('/sessions', async (req, res) => {
  try {
    await Session.deleteMany({});
    res.status(200).json({ message: 'All sessions deleted' });
  } catch (error) {
    console.error('Error deleting sessions:', error);
    res.status(500).json({ message: 'Error deleting sessions', error });
  }
});

module.exports = router;
