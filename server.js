const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// MongoDB connection (already set up in your previous steps)
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-local-db';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB Atlas is connected!');
});

// Route to display all posts
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  let html = '<h1>All Posts</h1>';
  html += '<a href="/new">Create New Post</a><ul>';
  posts.forEach(post => {
    html += `<li><strong>${post.title}</strong><br>${post.content}<br><small>${post.createdAt.toLocaleString()}</small></li>`;
  });
  html += '</ul>';
  res.send(html);
});

// Route to display the form for creating a post
app.get('/new', (req, res) => {
  res.send(`
    <h1>Create a New Post</h1>
    <form method="POST" action="/posts">
      <input type="text" name="title" placeholder="Title" required><br>
      <textarea name="content" placeholder="Content" required></textarea><br>
      <button type="submit">Create Post</button>
    </form>
    <a href="/posts">Back to Posts</a>
  `);
});

// Route to handle post creation
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  await Post.create({ title, content });
  res.redirect('/posts');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});