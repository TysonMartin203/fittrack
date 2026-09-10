const pool = require('../config/db');
const { maybeUpdatePR } = require('./pr.model');

async function logWorkout({ userId, exercise, sets, reps, weight, date }) {
  const [result] = await pool.query(
    'INSERT INTO Workouts (user_id, exercise, sets, reps, weight, date) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, exercise, sets, reps, weight, date]
  );
  const prResult = await maybeUpdatePR({ userId, exercise, weight, date });
  return { workoutId: result.insertId, ...prResult };
}

async function getWorkouts(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM Workouts WHERE user_id = ? ORDER BY date DESC, created_at DESC',
    [userId]
  );
  return rows;
}

async function deleteWorkout(id, userId) {
  const [result] = await pool.query(
    'DELETE FROM Workouts WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { logWorkout, getWorkouts, deleteWorkout };
