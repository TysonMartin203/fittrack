const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findByEmail } = require('../models/user.model');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    const id = await createUser({ username, email, password });
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: id, username });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Username or email already taken' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });
    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login };
