const pool = require('../config/db');

async function getProfile(userId) {
  const [[row]] = await pool.query('SELECT profile FROM Users WHERE id = ?', [userId]);
  if (!row?.profile) return null;
  return typeof row.profile === 'string' ? JSON.parse(row.profile) : row.profile;
}

async function saveProfile(userId, profile) {
  await pool.query('UPDATE Users SET profile = ? WHERE id = ?', [JSON.stringify(profile), userId]);
}

module.exports = { getProfile, saveProfile };
