const pool = require('../config/db');
const { areFriends } = require('./friend.model');

async function sendMessage({ senderId, receiverId, message }) {
  const friends = await areFriends(senderId, receiverId);
  if (!friends) throw new Error('Not friends');
  const [result] = await pool.query(
    'INSERT INTO Messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [senderId, receiverId, message]
  );
  return result.insertId;
}

async function getConversation(userId1, userId2) {
  const [rows] = await pool.query(
    `SELECT m.*, u.username AS sender_username
     FROM Messages m
     JOIN Users u ON u.id = m.sender_id
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [userId1, userId2, userId2, userId1]
  );
  return rows;
}

module.exports = { sendMessage, getConversation };
