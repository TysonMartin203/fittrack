const pool = require('../config/db');

async function getPRForExercise(userId, exercise) {
  const [rows] = await pool.query(
    'SELECT * FROM PRs WHERE user_id = ? AND exercise = ?',
    [userId, exercise]
  );
  return rows[0] || null;
}

async function getAllPRs(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM PRs WHERE user_id = ? ORDER BY exercise ASC',
    [userId]
  );
  return rows;
}

async function maybeUpdatePR({ userId, exercise, weight, date }) {
  const existing = await getPRForExercise(userId, exercise);

  if (!existing) {
    await pool.query(
      'INSERT INTO PRs (user_id, exercise, max_weight, achieved_on) VALUES (?, ?, ?, ?)',
      [userId, exercise, weight, date]
    );
    return { isNewPR: true, previousMax: null, newMax: weight };
  }

  if (Number(weight) > Number(existing.max_weight)) {
    await pool.query(
      'UPDATE PRs SET max_weight = ?, achieved_on = ? WHERE id = ?',
      [weight, date, existing.id]
    );
    return { isNewPR: true, previousMax: existing.max_weight, newMax: weight };
  }

  return { isNewPR: false, previousMax: existing.max_weight, newMax: existing.max_weight };
}

module.exports = { getAllPRs, getPRForExercise, maybeUpdatePR };
