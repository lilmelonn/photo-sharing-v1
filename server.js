require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const User = require('./backend/db/userModel');
const Photo = require('./backend/db/photoModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/photoapp')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware kiểm tra đăng nhập
const requireLogin = (req, res, next) => {
  if (req.session.userId) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

// ------------------- API -------------------

// Đăng ký
app.post('/user', async (req, res) => {
  console.log('📝 Register attempt:', req.body);
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existing = await User.findOne({ login_name });
    if (existing) return res.status(400).json({ error: 'Login name exists' });
    const user = new User({ login_name, password, first_name, last_name, location, description, occupation });
    await user.save();
    const { password: pwd, ...userData } = user.toObject();
    console.log('✅ User registered:', userData);
    res.status(201).json(userData);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập
app.post('/admin/login', async (req, res) => {
  console.log('🔐 Login request:', req.body);
  const { login_name, password } = req.body;
  if (!login_name || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      console.log('❌ User not found:', login_name);
      return res.status(400).json({ error: 'Invalid login' });
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      console.log('❌ Wrong password for:', login_name);
      return res.status(400).json({ error: 'Invalid login' });
    }
    req.session.userId = user._id;
    const { password: pwd, ...userData } = user.toObject();
    console.log('✅ Login successful:', userData);
    res.json(userData);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Đăng xuất
app.post('/admin/logout', (req, res) => {
  if (!req.session.userId) return res.status(400).json({ error: 'Not logged in' });
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

// Lấy danh sách user (chỉ _id, first_name, last_name)
app.get('/user/list', requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết user
app.get('/user/:id', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'first_name last_name location description occupation');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' });
  }
});

// Lấy danh sách ảnh của user kèm comments
app.get('/photosOfUser/:id', requireLogin, async (req, res) => {
  try {
    const photos = await Photo.find({ user_id: req.params.id })
      .populate('comments.user', 'first_name last_name');
    const result = photos.map(p => ({
      _id: p._id,
      user_id: p.user_id,
      file_name: p.file_name,
      date_time: p.date_time,
      comments: p.comments.map(c => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: { _id: c.user._id, first_name: c.user.first_name, last_name: c.user.last_name }
      }))
    }));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' });
  }
});

// Thêm comment
app.post('/commentsOfPhoto/:photo_id', requireLogin, async (req, res) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === '') return res.status(400).json({ error: 'Empty comment' });
  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    const newComment = { comment: comment.trim(), date_time: new Date(), user: req.session.userId };
    photo.comments.push(newComment);
    await photo.save();
    const added = photo.comments[photo.comments.length - 1];
    await added.populate('user', 'first_name last_name');
    res.status(201).json(added);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload ảnh
const storage = multer.diskStorage({
  destination: './images/',
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/photos/new', requireLogin, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const newPhoto = new Photo({
      user_id: req.session.userId,
      file_name: req.file.filename,
      date_time: new Date(),
      comments: []
    });
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});