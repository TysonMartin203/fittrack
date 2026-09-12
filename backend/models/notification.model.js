const pool = require('../config/db');

async function createNotification({ userId, type, title, body, data }) {
  const [result] = await pool.query(
    'INSERT INTO Notifications (user_id, type, title, body, data) VALUES (?, ?, ?, ?, ?)',
    [userId, type, title, body || null, data ? JSON.stringify(data) : null]
  );
  return result.insertId;
}

module.exports = { createNotification };
