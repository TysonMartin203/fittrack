const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function createUser({ username, email, password }) {
  const hash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hash]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const [rows] = await pool.query(
    'SELECT id, username, email FROM Users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, email FROM Users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByGoogleId(googleId) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE google_id = ?', [googleId]);
  return rows[0] || null;
}

async function linkGoogleId(userId, googleId) {
  await pool.query('UPDATE Users SET google_id = ? WHERE id = ?', [googleId, userId]);
}

// Turn "Jane Doe" / "jane.doe@gmail.com" into a unique, valid username, retrying with a
// numeric suffix on collision since usernames must be unique.
async function generateUniqueUsername(base) {
  let candidate = String(base || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
  let suffix = 0;
  while (await findByUsername(candidate)) {
    suffix++;
    candidate = `${candidate.slice(0, 20 - String(suffix).length)}${suffix}`;
  }
  return candidate;
}

async function createGoogleUser({ email, googleId, name }) {
  const username = await generateUniqueUsername(name || email.split('@')[0]);
  const [result] = await pool.query(
    'INSERT INTO Users (username, email, password_hash, google_id) VALUES (?, ?, NULL, ?)',
    [username, email, googleId]
  );
  return { id: result.insertId, username };
}

module.exports = {
  createUser, findByEmail, findByUsername, findById,
  findByGoogleId, linkGoogleId, createGoogleUser, generateUniqueUsername,
};
