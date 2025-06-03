const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

// ---------------------------------------------
// POST /api/auth/register — Register a new user
// ---------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, address, phone, password } = req.body;

    console.log("📩 Received signup data:", req.body); // Debug log

    // Validation
    if (!fullName || !email || !address || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create new user
    const user = new User({ fullName, email, address, phone, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Registration successful', token });
  } catch (err) {
    console.error('❌ Error in POST /register:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ---------------------------------------------
// POST /api/auth/login — Login user
// ---------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic input check
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const userObj = user.toObject();
    delete userObj.password; // Remove sensitive data

    res.status(200).json({ message: 'Login successful', token, user: userObj });
  } catch (err) {
    console.error('❌ Error in POST /login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
