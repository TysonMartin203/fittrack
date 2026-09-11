const pool = require('../config/db');
const { areFriends } = require('./friend.model');

async function createInvite({ senderId, receiverId, proposedAt, message }) {
  const friends = await areFriends(senderId, receiverId);
  if (!friends) throw Object.assign(new Error('Not friends'), { status: 403 });
  const [result] = await pool.query(
    'INSERT INTO TrainInvites (sender_id, receiver_id, proposed_at, message) VALUES (?, ?, ?, ?)',
    [senderId, receiverId, proposedAt, message || null]
  );
  return result.insertId;
}

async function getInvites(userId) {
  const [rows] = await pool.query(
    `SELECT ti.*, su.username AS sender_username, ru.username AS receiver_username
     FROM TrainInvites ti
     JOIN Users su ON su.id = ti.sender_id
     JOIN Users ru ON ru.id = ti.receiver_id
     WHERE ti.sender_id = ? OR ti.receiver_id = ?
     ORDER BY ti.proposed_at ASC`,
    [userId, userId]
  );
  return rows;
}

async function respondInvite(id, userId, status) {
  const [result] = await pool.query(
    `UPDATE TrainInvites SET status = ? WHERE id = ? AND receiver_id = ? AND status = 'pending'`,
    [status, id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { createInvite, getInvites, respondInvite };
