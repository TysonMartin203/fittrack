const pool = require('../config/db');
const { addFeedEvent } = require('./feed.model');

async function getPRForExercise(userId, exercise, conn = pool) {
  const [rows] = await conn.query(
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

// Pass `conn` when called from inside another transaction (e.g. workout creation) —
// PRs.workout_id is a foreign key to Workouts, so running this on a *different*
// connection than the one holding the workout's (uncommitted) row causes a lock-wait
// timeout while it waits for a lock that won't release until that transaction commits.
async function maybeUpdatePR({ userId, exercise, weight, date, workoutId = null, workoutExerciseId = null, conn = pool, unit = 'lbs' }) {
  const existing = await getPRForExercise(userId, exercise, conn);
  const unitLabel = unit === 'reps' ? 'reps' : 'lbs';

  if (!existing) {
    await conn.query(
      'INSERT INTO PRs (user_id, exercise, max_weight, achieved_on, workout_id, workout_exercise_id, unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, exercise, weight, date, workoutId, workoutExerciseId, unit]
    );
    addFeedEvent({
      userId, type: 'pr', refId: workoutId,
      headline: `hit a new PR — ${exercise}`,
      detail: `${weight} ${unitLabel}`,
    }).catch(err => console.error('Feed event failed:', err));
    return { isNewPR: true, previousMax: null, newMax: weight };
  }

  if (Number(weight) > Number(existing.max_weight)) {
    await conn.query(
      'UPDATE PRs SET max_weight = ?, achieved_on = ?, workout_id = ?, workout_exercise_id = ?, unit = ? WHERE id = ?',
      [weight, date, workoutId, workoutExerciseId, unit, existing.id]
    );
    addFeedEvent({
      userId, type: 'pr', refId: workoutId,
      headline: `hit a new PR — ${exercise}`,
      detail: `${existing.max_weight} → ${weight} ${unitLabel}`,
    }).catch(err => console.error('Feed event failed:', err));
    return { isNewPR: true, previousMax: existing.max_weight, newMax: weight };
  }

  return { isNewPR: false, previousMax: existing.max_weight, newMax: existing.max_weight };
}

module.exports = { getAllPRs, getPRForExercise, maybeUpdatePR };
