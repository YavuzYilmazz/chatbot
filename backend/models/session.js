const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  questions: [{ question: String, answer: String }],
  currentQuestionIndex: { type: Number, default: 0 },
  start: { type: Date, default: Date.now },
  end: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);
