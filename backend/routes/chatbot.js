const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Predefined questions
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

// Start a new session and save to the database
router.post('/session', async (req, res) => {
  try {
    const sessionId = uuidv4(); // Create a unique session ID
    const session = new Session({
      sessionId,
      questions: [], // Initialize an empty array for questions
      currentQuestionIndex: 0, // Start at the first question
      start: Date.now() // Set the start time for the session
    });
    
    await session.save(); // Save session to the database

    // Return session ID and the first question immediately
    res.status(201).json({ sessionId, question: questions[0] }); 
  } catch (error) {
    console.error('Error creating session:', error); // Log error to console
    res.status(500).json({ message: 'Error creating session', error });
  }
});

// Save user's answer to the current question
router.post('/session/:sessionId/answer', upload.none(), async (req, res) => {
  const { sessionId } = req.params;
  const { answer } = req.body; // form-data'dan gelen cevap

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if the current question index is valid
    if (session.currentQuestionIndex < questions.length) {
      const currentQuestion = questions[session.currentQuestionIndex];
      session.questions.push({ 
        question: currentQuestion, 
        answer 
      });

      session.currentQuestionIndex++;
      await session.save();

      if (session.currentQuestionIndex < questions.length) {
        res.status(200).json({
          message: 'Answer saved',
          question: questions[session.currentQuestionIndex],
          answer
        });
      } else {
        session.end = Date.now(); // Set the end time for the session
        await session.save(); // Ensure the final session state is saved
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

// Get all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find(); // Fetch all sessions from the database
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
});




// Get the current question for a specific session
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
    console.error('Error retrieving question:', error); // Log error to console
    res.status(500).json({ message: 'Error retrieving question', error });
  }
});

// Get all answers for a specific session
router.get('/session/:sessionId/answers', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session.questions);
  } catch (error) {
    console.error('Error retrieving answers:', error); // Log error to console
    res.status(500).json({ message: 'Error retrieving answers', error });
  }
});

// Delete a session
router.delete('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOneAndDelete({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error); // Log error to console
    res.status(500).json({ message: 'Error deleting session', error });
  }
});

// Delete all sessions
router.delete('/sessions', async (req, res) => {
  try {
    await Session.deleteMany({});
    res.status(200).json({ message: 'All sessions deleted' });
  } catch (error) {
    console.error('Error deleting sessions:', error); // Log error to console
    res.status(500).json({ message: 'Error deleting sessions', error });
  }
});

module.exports = router;
