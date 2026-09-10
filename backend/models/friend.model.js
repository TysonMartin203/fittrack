const pool = require('../config/db');

async function sendRequest(requesterId, receiverId) {
  await pool.query(
    'INSERT INTO Friends (requester_id, receiver_id, status) VALUES (?, ?, "pending")',
    [requesterId, receiverId]
  );
}

async function acceptRequest(requesterId, receiverId) {
  await pool.query(
    'UPDATE Friends SET status = "accepted" WHERE requester_id = ? AND receiver_id = ?',
    [requesterId, receiverId]
  );
}

async function getFriends(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.email, f.status,
            CASE WHEN f.requester_id = ? THEN 'sent' ELSE 'received' END AS direction
     FROM Friends f
     JOIN Users u ON u.id = IF(f.requester_id = ?, f.receiver_id, f.requester_id)
     WHERE f.requester_id = ? OR f.receiver_id = ?`,
    [userId, userId, userId, userId]
  );
  return rows;
}

async function areFriends(userId1, userId2) {
  const [rows] = await pool.query(
    `SELECT 1 FROM Friends
     WHERE status = 'accepted'
       AND ((requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?))`,
    [userId1, userId2, userId2, userId1]
  );
  return rows.length > 0;
}

module.exports = { sendRequest, acceptRequest, getFriends, areFriends };
