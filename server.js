const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dynamic_site_demo');

// Define the Post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// Set up the view engine and static folder
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Home page: Show all posts and add form
app.get('/', async (req, res) => {
  const posts = await Post.find().sort({date: -1});
  res.render('index', { posts, editPost: null, error: null });
});

// Add new post (with validation)
app.post('/add', async (req, res) => {
  const { title, content } = req.body;
  if (!title.trim() || !content.trim()) {
    const posts = await Post.find().sort({date: -1});
    return res.render('index', { posts, editPost: null, error: 'Title and Content are required.' });
  }
  await Post.create({ title, content });
  res.redirect('/');
});

// Show edit form for a post
app.get('/edit/:id', async (req, res) => {
  const posts = await Post.find().sort({date: -1});
  const editPost = await Post.findById(req.params.id);
  res.render('index', { posts, editPost, error: null });
});

// Update the post (with validation)
app.post('/edit/:id', async (req, res) => {
  const { title, content } = req.body;
  if (!title.trim() || !content.trim()) {
    const posts = await Post.find().sort({date: -1});
    const editPost = await Post.findById(req.params.id);
    return res.render('index', { posts, editPost, error: 'Title and Content are required.' });
  }
  await Post.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect('/');
});

// Delete a post
app.post('/delete/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});