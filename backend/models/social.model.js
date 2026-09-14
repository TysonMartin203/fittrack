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

// Consecutive-week streak (Mon-Sun) — one workout anywhere in a week keeps it alive.
// Ends this week or last week, so a streak isn't zeroed out just because this week isn't over yet.
async function computeWeeklyStreak(userId) {
  const [rows] = await pool.query(
    'SELECT DISTINCT date FROM Workouts WHERE user_id = ? ORDER BY date DESC LIMIT 1000',
    [userId]
  );
  if (!rows.length) return 0;

  function mondayOf(dateStr) {
    const d = new Date(dateStr + 'T00:00:00Z');
    const day = d.getUTCDay(); // 0=Sun .. 6=Sat
    const diff = day === 0 ? 6 : day - 1; // days since Monday
    d.setUTCDate(d.getUTCDate() - diff);
    return d.getTime();
  }

  const weekMs = 7 * 86400000;
  const weekSet = new Set(rows.map(r => mondayOf(r.date)));

  const now = new Date(); now.setUTCHours(0, 0, 0, 0);
  const nowDay = now.getUTCDay();
  const diffToMonday = nowDay === 0 ? 6 : nowDay - 1;
  const thisMonday = new Date(now); thisMonday.setUTCDate(now.getUTCDate() - diffToMonday);
  const thisMondayMs = thisMonday.getTime();

  let cursor = weekSet.has(thisMondayMs) ? thisMondayMs : weekSet.has(thisMondayMs - weekMs) ? thisMondayMs - weekMs : null;
  if (cursor === null) return 0;

  let streak = 0;
  while (weekSet.has(cursor)) {
    streak++;
    cursor -= weekMs;
  }
  return streak;
}

function periodFilter(period) {
  switch (period) {
    case 'month':    return "AND w.date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')";
    case 'year':     return "AND w.date >= DATE_FORMAT(CURDATE(), '%Y-01-01')";
    case 'lifetime': return '';
    case 'week':
    default:         return 'AND w.date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)'; // Monday-start
  }
}

async function workoutsForPeriod(userId, period) {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS n FROM Workouts w WHERE w.user_id = ? ${periodFilter(period)}`,
    [userId]
  );
  return row.n;
}

async function volumeForPeriod(userId, period) {
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
     WHERE w.user_id = ? AND we.category = 'lifting' ${periodFilter(period)}`,
    [userId]
  );
  return Number(row.volume) || 0;
}

// volumeAllTime is used directly by the /api/social/volume route (Progress tab's all-time stat).
async function volumeAllTime(userId) { return volumeForPeriod(userId, 'lifetime'); }

// Leaderboard across the user + their accepted friends, for one specific metric+period.
async function getLeaderboard(userId, metric = 'workouts', period = 'week') {
  const [friendRows] = await pool.query(
    `SELECT u.id, u.username FROM Friends f
     JOIN Users u ON u.id = IF(f.requester_id = ?, f.receiver_id, f.requester_id)
     WHERE (f.requester_id = ? OR f.receiver_id = ?) AND f.status = 'accepted'`,
    [userId, userId, userId]
  );
  const [[me]] = await pool.query('SELECT id, username FROM Users WHERE id = ?', [userId]);
  const people = [me, ...friendRows];

  const results = await Promise.all(people.map(async (p) => {
    let value;
    if (metric === 'volume') value = await volumeForPeriod(p.id, period);
    else if (metric === 'streak') value = period === 'weekly' ? await computeWeeklyStreak(p.id) : await computeStreak(p.id);
    else value = await workoutsForPeriod(p.id, period);
    return { id: p.id, username: p.username, value };
  }));

  results.sort((a, b) => b.value - a.value);
  return results;
}

module.exports = {
  computeStreak, volumeAllTime, getLeaderboard,
};
