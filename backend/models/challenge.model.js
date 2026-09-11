const pool = require('../config/db');
const { areFriends } = require('./friend.model');
const { addFeedEvent } = require('./feed.model');

async function createChallenge(userId, { title, type, exercise, targetValue, startDate, endDate }) {
  const [result] = await pool.query(
    `INSERT INTO Challenges (creator_id, title, type, exercise, target_value, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, type, type === 'pr_gain' ? exercise : null, targetValue || null, startDate, endDate]
  );
  const id = result.insertId;
  await pool.query('INSERT INTO ChallengeParticipants (challenge_id, user_id) VALUES (?, ?)', [id, userId]);
  addFeedEvent({
    userId, type: 'challenge', refId: id,
    headline: `started a challenge — ${title}`,
    detail: type === 'most_workouts' ? 'Most workouts' : `Biggest ${exercise} gain`,
  }).catch(err => console.error('Feed event failed:', err));
  return id;
}

// Visible = created by you, joined by you, or created by a friend
async function listChallenges(userId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT c.*, u.username AS creator_username,
            EXISTS(SELECT 1 FROM ChallengeParticipants p WHERE p.challenge_id = c.id AND p.user_id = ?) AS joined
     FROM Challenges c
     JOIN Users u ON u.id = c.creator_id
     LEFT JOIN ChallengeParticipants cp ON cp.challenge_id = c.id AND cp.user_id = ?
     LEFT JOIN Friends f ON (
       (f.requester_id = ? AND f.receiver_id = c.creator_id) OR
       (f.receiver_id = ? AND f.requester_id = c.creator_id)
     ) AND f.status = 'accepted'
     WHERE c.creator_id = ? OR cp.user_id IS NOT NULL OR f.status = 'accepted'
     ORDER BY c.end_date ASC`,
    [userId, userId, userId, userId, userId]
  );
  return rows;
}

async function joinChallenge(challengeId, userId) {
  const [[challenge]] = await pool.query('SELECT * FROM Challenges WHERE id = ?', [challengeId]);
  if (!challenge) throw Object.assign(new Error('Not found'), { status: 404 });
  const friends = await areFriends(userId, challenge.creator_id);
  if (!friends && challenge.creator_id !== userId)
    throw Object.assign(new Error('You can only join challenges from friends'), { status: 403 });
  await pool.query('INSERT IGNORE INTO ChallengeParticipants (challenge_id, user_id) VALUES (?, ?)', [challengeId, userId]);
  if (userId !== challenge.creator_id) {
    addFeedEvent({
      userId, type: 'challenge', refId: challengeId,
      headline: `joined a challenge — ${challenge.title}`,
      detail: challenge.type === 'most_workouts' ? 'Most workouts' : `Biggest ${challenge.exercise} gain`,
    }).catch(err => console.error('Feed event failed:', err));
  }
}

async function getChallengeProgress(challengeId, userId) {
  const [[challenge]] = await pool.query('SELECT * FROM Challenges WHERE id = ?', [challengeId]);
  if (!challenge) return null;

  const [participants] = await pool.query(
    `SELECT u.id, u.username FROM ChallengeParticipants cp JOIN Users u ON u.id = cp.user_id WHERE cp.challenge_id = ?`,
    [challengeId]
  );
  const isParticipant = participants.some(p => p.id === userId);
  if (!isParticipant) {
    const friends = await areFriends(userId, challenge.creator_id);
    if (!friends && challenge.creator_id !== userId) return null;
  }

  let leaderboard;
  if (challenge.type === 'most_workouts') {
    leaderboard = await Promise.all(participants.map(async (p) => {
      const [[row]] = await pool.query(
        'SELECT COUNT(*) AS n FROM Workouts WHERE user_id = ? AND date BETWEEN ? AND ?',
        [p.id, challenge.start_date, challenge.end_date]
      );
      return { id: p.id, username: p.username, progress: row.n, unit: 'workouts' };
    }));
  } else {
    // pr_gain: weight added to a specific exercise during the challenge window
    leaderboard = await Promise.all(participants.map(async (p) => {
      const [[baseline]] = await pool.query(
        `SELECT MAX(GREATEST(COALESCE(we.weight,0), COALESCE((
            SELECT MAX(ws.weight) FROM WorkoutSets ws WHERE ws.workout_exercise_id = we.id
          ),0))) AS w
         FROM WorkoutExercises we JOIN Workouts w ON w.id = we.workout_id
         WHERE w.user_id = ? AND we.exercise_name = ? AND we.category = 'lifting' AND w.date < ?`,
        [p.id, challenge.exercise, challenge.start_date]
      );
      const [[peak]] = await pool.query(
        `SELECT MAX(GREATEST(COALESCE(we.weight,0), COALESCE((
            SELECT MAX(ws.weight) FROM WorkoutSets ws WHERE ws.workout_exercise_id = we.id
          ),0))) AS w
         FROM WorkoutExercises we JOIN Workouts w ON w.id = we.workout_id
         WHERE w.user_id = ? AND we.exercise_name = ? AND we.category = 'lifting' AND w.date BETWEEN ? AND ?`,
        [p.id, challenge.exercise, challenge.start_date, challenge.end_date]
      );
      const base = Number(baseline.w) || 0;
      const peakW = Number(peak.w) || 0;
      return { id: p.id, username: p.username, progress: Math.max(0, peakW - base), unit: 'lbs gained', baseline: base, current: peakW };
    }));
  }

  leaderboard.sort((a, b) => b.progress - a.progress);
  return { ...challenge, leaderboard };
}

module.exports = { createChallenge, listChallenges, joinChallenge, getChallengeProgress };
