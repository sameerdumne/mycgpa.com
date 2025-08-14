const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Semester = require('./models/Semester');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'your_secret_key'; // Use env variable in production

const app = express();
app.use(bodyParser.json());


// User registration route (hash password)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route (verify password, return JWT)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// JWT authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
}

// Protected: Get all semesters
app.get('/api/semesters', authMiddleware, async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Create a semester
app.post('/api/semesters', authMiddleware, async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).json(semester);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected: Delete a semester
app.delete('/api/semesters/:id', authMiddleware, async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);
    res.json({ message: 'Semester deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mycgpa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));
