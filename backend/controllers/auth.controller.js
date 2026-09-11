const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool   = require('../config/db');
const { createUser, findByEmail } = require('../models/user.model');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    const id = await createUser({ username, email, password });
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: id, username, email, theme: 'light', bio: null, notifyBuzz: true, notifyMessages: true });
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
    res.json({
      token, userId: user.id, username: user.username, email: user.email,
      avatarUrl: user.avatar_url || null, theme: user.theme || 'light',
      bio: user.bio || null,
      notifyBuzz: user.notify_buzz == null ? true : !!user.notify_buzz,
      notifyMessages: user.notify_messages == null ? true : !!user.notify_messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateTheme(req, res) {
  try {
    const { theme } = req.body;
    if (!['light', 'dark'].includes(theme)) return res.status(400).json({ error: 'Invalid theme' });
    await pool.query('UPDATE Users SET theme = ? WHERE id = ?', [theme, req.userId]);
    res.json({ theme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function uploadAvatar(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    await pool.query('UPDATE Users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.userId]);
    res.json({ avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateSettings(req, res) {
  try {
    const { bio, notifyBuzz, notifyMessages } = req.body;
    const sets = []; const vals = [];
    if (bio !== undefined) { sets.push('bio = ?'); vals.push(bio ? String(bio).slice(0, 280) : null); }
    if (notifyBuzz !== undefined) { sets.push('notify_buzz = ?'); vals.push(notifyBuzz ? 1 : 0); }
    if (notifyMessages !== undefined) { sets.push('notify_messages = ?'); vals.push(notifyMessages ? 1 : 0); }
    if (sets.length === 0) return res.json({ success: true });
    vals.push(req.userId);
    await pool.query(`UPDATE Users SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, uploadAvatar, updateTheme, updateSettings };
