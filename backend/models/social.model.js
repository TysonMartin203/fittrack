const pool = require('../config/db');

// Consecutive-day streak ending today or yesterday (so a rest day today doesn't zero it out).
async function computeStreak(userId) {
  const [rows] = await pool.query(
    'SELECT DISTINCT date FROM Workouts WHERE user_id = ? ORDER BY date DESC LIMIT 400',
    [userId]
  );
  if (!rows.length) return 0;

  const dates = rows.map(r => new Date(r.date + 'T00:00:00Z').getTime());
  const dayMs = 86400000;
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  let cursor = dates[0] === todayMs ? todayMs : dates[0] === todayMs - dayMs ? todayMs - dayMs : null;
  if (cursor === null) return 0; // most recent workout wasn't today or yesterday — streak is broken

  let streak = 0;
  const set = new Set(dates);
  while (set.has(cursor)) {
    streak++;
    cursor -= dayMs;
  }
  return streak;
}

async function volumeThisWeek(userId) {
  const [[row]] = await pool.query(
    `SELECT
       COALESCE(SUM(
         CASE WHEN we.per_set_weights = 1 THEN (
           SELECT COALESCE(SUM(COALESCE(ws.reps,0) * COALESCE(ws.weight,0)),0)
           FROM WorkoutSets ws WHERE ws.workout_exercise_id = we.id
         ) ELSE COALESCE(we.sets,0) * COALESCE(we.reps,0) * COALESCE(we.weight,0) END
       ), 0) AS volume
     FROM WorkoutExercises we
     JOIN Workouts w ON w.id = we.workout_id
     WHERE w.user_id = ? AND we.category = 'lifting'
       AND w.date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`,
    [userId]
  );
  return Number(row.volume) || 0;
}

async function workoutsThisWeek(userId) {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS n FROM Workouts
     WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`,
    [userId]
  );
  return row.n;
}

// Leaderboard across the user + their accepted friends
async function getLeaderboard(userId) {
  const [friendRows] = await pool.query(
    `SELECT u.id, u.username FROM Friends f
     JOIN Users u ON u.id = IF(f.requester_id = ?, f.receiver_id, f.requester_id)
     WHERE (f.requester_id = ? OR f.receiver_id = ?) AND f.status = 'accepted'`,
    [userId, userId, userId]
  );
  const [[me]] = await pool.query('SELECT id, username FROM Users WHERE id = ?', [userId]);
  const people = [me, ...friendRows];

  const results = await Promise.all(people.map(async (p) => ({
    id: p.id,
    username: p.username,
    workoutsThisWeek: await workoutsThisWeek(p.id),
    volumeThisWeek: await volumeThisWeek(p.id),
    streak: await computeStreak(p.id),
  })));

  return {
    byWorkouts: [...results].sort((a, b) => b.workoutsThisWeek - a.workoutsThisWeek),
    byVolume: [...results].sort((a, b) => b.volumeThisWeek - a.volumeThisWeek),
    byStreak: [...results].sort((a, b) => b.streak - a.streak),
  };
}

module.exports = { computeStreak, volumeThisWeek, workoutsThisWeek, getLeaderboard };
