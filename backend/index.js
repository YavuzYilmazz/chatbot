const express = require('express');
const mongoose = require('mongoose');
const chatbotRoutes = require('./routes/chatbot');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

// Initialize the Express application
const app = express();

// Middleware for CORS
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the chatbot routes
app.use('/api', chatbotRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
