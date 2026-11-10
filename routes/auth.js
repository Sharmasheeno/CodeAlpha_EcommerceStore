const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ message: 'Database unavailable. Please make sure MongoDB is running.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ message: 'Invalid email or password.' });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ message: 'Database unavailable. Please make sure MongoDB is running.' });
  }
});

// GET /api/auth/me  (current user, requires token)
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
