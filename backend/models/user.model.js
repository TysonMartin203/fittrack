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

module.exports = { createUser, findByEmail, findByUsername, findById };
