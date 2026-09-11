const pool = require('../config/db');
const { areFriends } = require('./friend.model');

async function createCrew(userId, name) {
  const [result] = await pool.query('INSERT INTO Crews (name, created_by) VALUES (?, ?)', [name, userId]);
  await pool.query('INSERT INTO CrewMembers (crew_id, user_id) VALUES (?, ?)', [result.insertId, userId]);
  return result.insertId;
}

async function getMyCrews(userId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.created_by, c.created_at, COUNT(cm2.user_id) AS member_count
     FROM Crews c
     JOIN CrewMembers cm ON cm.crew_id = c.id AND cm.user_id = ?
     JOIN CrewMembers cm2 ON cm2.crew_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
}

async function isCrewMember(crewId, userId) {
  const [rows] = await pool.query('SELECT 1 FROM CrewMembers WHERE crew_id = ? AND user_id = ?', [crewId, userId]);
  return rows.length > 0;
}

async function getCrew(crewId, userId) {
  if (!(await isCrewMember(crewId, userId))) return null;
  const [[crew]] = await pool.query('SELECT * FROM Crews WHERE id = ?', [crewId]);
  if (!crew) return null;
  const [members] = await pool.query(
    `SELECT u.id, u.username FROM CrewMembers cm JOIN Users u ON u.id = cm.user_id WHERE cm.crew_id = ?`,
    [crewId]
  );
  return { ...crew, members };
}

async function addMember(crewId, requesterId, friendId) {
  if (!(await isCrewMember(crewId, requesterId))) throw Object.assign(new Error('Not a member'), { status: 403 });
  const friends = await areFriends(requesterId, friendId);
  if (!friends) throw Object.assign(new Error('Can only add friends to a crew'), { status: 400 });
  await pool.query('INSERT IGNORE INTO CrewMembers (crew_id, user_id) VALUES (?, ?)', [crewId, friendId]);
}

async function getMessages(crewId, userId) {
  if (!(await isCrewMember(crewId, userId))) throw Object.assign(new Error('Not a member'), { status: 403 });
  const [rows] = await pool.query(
    `SELECT cm.*, u.username FROM CrewMessages cm JOIN Users u ON u.id = cm.user_id
     WHERE cm.crew_id = ? ORDER BY cm.created_at ASC LIMIT 200`,
    [crewId]
  );
  return rows;
}

async function sendMessage(crewId, userId, message) {
  if (!(await isCrewMember(crewId, userId))) throw Object.assign(new Error('Not a member'), { status: 403 });
  const [result] = await pool.query(
    'INSERT INTO CrewMessages (crew_id, user_id, message) VALUES (?, ?, ?)',
    [crewId, userId, message]
  );
  return result.insertId;
}

module.exports = { createCrew, getMyCrews, getCrew, addMember, getMessages, sendMessage, isCrewMember };
