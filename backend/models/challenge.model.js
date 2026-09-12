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

module.exports = { createChallenge, listChallenges, joinChallenge };
