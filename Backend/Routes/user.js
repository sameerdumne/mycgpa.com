const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Add SGPA Record
router.post('/add-sgpa', async (req, res) => {
  const { userId, semester, subjects } = req.body;

  const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);
  const sgpaSum = subjects.reduce((acc, sub) => acc + (sub.gradePoint * sub.credits), 0);
  const sgpa = sgpaSum / totalCredits;

  const user = await User.findById(userId);
  user.sgpaRecords.push({ semester, subjects, sgpa });
  await user.save();

  res.json({ sgpa });
});

// Get CGPA
router.get('/get-cgpa/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  const sgpas = user.sgpaRecords.map(r => r.sgpa);
  const cgpa = sgpas.reduce((a, b) => a + b, 0) / sgpas.length;

  res.json({ cgpa, sgpaRecords: user.sgpaRecords });
});

module.exports = router;
