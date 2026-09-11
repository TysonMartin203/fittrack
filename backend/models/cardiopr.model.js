const pool = require('../config/db');
const { addFeedEvent } = require('./feed.model');

// Distances in miles. Matched within ±3% to allow for real-world GPS/treadmill variance.
const CARDIO_MILESTONES = {
  Running: [
    { label: 'Mile', miles: 1 },
    { label: '5K', miles: 3.10686 },
    { label: '10K', miles: 6.21371 },
    { label: 'Half Marathon', miles: 13.1094 },
    { label: 'Marathon', miles: 26.2188 },
  ],
  Walking: [
    { label: 'Mile', miles: 1 },
    { label: '5K', miles: 3.10686 },
    { label: '10K', miles: 6.21371 },
  ],
  Hiking: [
    { label: '5 Mile Hike', miles: 5 },
    { label: '10 Mile Hike', miles: 10 },
  ],
  Biking: [
    { label: '20 Mile Ride', miles: 20 },
    { label: 'Metric Century', miles: 62.137 },
    { label: 'Century', miles: 100 },
  ],
  Swimming: [
    { label: '500m Swim', miles: 0.31069 },
    { label: '1K Swim', miles: 0.62137 },
    { label: 'Mile Swim', miles: 1 },
  ],
  Rowing: [
    { label: '2K Row', miles: 1.24274 },
    { label: '5K Row', miles: 3.10686 },
  ],
};

function toMiles(distance, unit) {
  const d = Number(distance);
  if (!d || isNaN(d)) return null;
  switch (unit) {
    case 'mi': return d;
    case 'km': return d * 0.621371;
    case 'm':  return d * 0.000621371;
    case 'yd': return d * 0.000568182;
    default:   return null; // 'laps' is ambiguous (pool length varies) — skip
  }
}

function matchMilestone(activity, distanceMiles) {
  const list = CARDIO_MILESTONES[activity];
  if (!list || distanceMiles == null) return null;
  for (const m of list) {
    if (Math.abs(distanceMiles - m.miles) / m.miles <= 0.03) return m.label;
  }
  return null;
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${m}:${String(s).padStart(2,'0')}`;
}

// conn: pass the caller's transaction connection so this doesn't deadlock against
// an uncommitted parent Workout row (same lesson as the lifting-PR lock-wait bug).
async function maybeUpdateCardioPR({ userId, activity, distance, distanceUnit, durationMinutes, date, workoutId = null, workoutExerciseId = null, conn = pool }) {
  if (!durationMinutes) return null;
  const miles = toMiles(distance, distanceUnit);
  const label = matchMilestone(activity, miles);
  if (!label) return null;

  const seconds = Math.round(Number(durationMinutes) * 60);
  if (!seconds || seconds <= 0) return null;
  const milestone = `Fastest ${label}`;

  const [[existing]] = await conn.query('SELECT * FROM CardioPRs WHERE user_id = ? AND milestone = ?', [userId, milestone]);

  if (!existing) {
    await conn.query(
      'INSERT INTO CardioPRs (user_id, milestone, activity, best_seconds, achieved_on, workout_id, workout_exercise_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, milestone, activity, seconds, date, workoutId, workoutExerciseId]
    );
    addFeedEvent({
      userId, type: 'pr', refId: workoutId,
      headline: `hit a new PR — ${milestone}`,
      detail: formatTime(seconds),
    }).catch(err => console.error('Feed event failed:', err));
    return { exercise: milestone, isNewPR: true, previousMax: null, newMax: formatTime(seconds), unit: 'time' };
  }

  if (seconds < existing.best_seconds) {
    await conn.query(
      'UPDATE CardioPRs SET best_seconds = ?, achieved_on = ?, workout_id = ?, workout_exercise_id = ? WHERE id = ?',
      [seconds, date, workoutId, workoutExerciseId, existing.id]
    );
    addFeedEvent({
      userId, type: 'pr', refId: workoutId,
      headline: `hit a new PR — ${milestone}`,
      detail: `${formatTime(existing.best_seconds)} → ${formatTime(seconds)}`,
    }).catch(err => console.error('Feed event failed:', err));
    return { exercise: milestone, isNewPR: true, previousMax: formatTime(existing.best_seconds), newMax: formatTime(seconds), unit: 'time' };
  }

  return { exercise: milestone, isNewPR: false, previousMax: formatTime(existing.best_seconds), newMax: formatTime(existing.best_seconds), unit: 'time' };
}

async function getCardioPRs(userId) {
  const [rows] = await pool.query('SELECT * FROM CardioPRs WHERE user_id = ? ORDER BY milestone ASC', [userId]);
  return rows.map(r => ({ ...r, formatted: formatTime(r.best_seconds) }));
}

module.exports = { maybeUpdateCardioPR, getCardioPRs, formatTime, CARDIO_MILESTONES };
