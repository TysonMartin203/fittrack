const pool = require('../config/db');

async function createNotification({ userId, type, title, body, data }) {
  const [result] = await pool.query(
    'INSERT INTO Notifications (user_id, type, title, body, data) VALUES (?, ?, ?, ?, ?)',
    [userId, type, title, body || null, data ? JSON.stringify(data) : null]
  );
  return result.insertId;
}

async function getNotifications(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return rows;
}

async function markRead(id, userId) {
  await pool.query('UPDATE Notifications SET read_at = NOW() WHERE id = ? AND user_id = ?', [id, userId]);
}

async function markAllRead(userId) {
  await pool.query('UPDATE Notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL', [userId]);
}

module.exports = { createNotification, getNotifications, markRead, markAllRead };
