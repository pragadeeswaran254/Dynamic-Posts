const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // If you use a .env file locally

const app = express();
const PORT = process.env.PORT || 3000;

// Use the MONGODB_URI from environment variables, fallback to local MongoDB for development
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-local-db';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB Atlas is connected!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});