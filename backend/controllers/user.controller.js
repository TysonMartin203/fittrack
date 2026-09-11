const pool = require('../config/db');
const { areFriends } = require('../models/friend.model');
const { computeStreak } = require('../models/social.model');

async function getProfile(req, res) {
  try {
    const targetId = req.params.id;
    if (Number(targetId) === req.userId) {
      // viewing your own profile via this route — allowed, no friend check needed
    } else {
      const friends = await areFriends(req.userId, targetId);
      if (!friends) return res.status(403).json({ error: 'Not friends with this user' });
    }

    const [[user]] = await pool.query(
      'SELECT id, username, avatar_url, bio, created_at FROM Users WHERE id = ?',
      [targetId]
    );
    if (!user) return res.status(404).json({ error: 'Not found' });

    const [[wRow]] = await pool.query('SELECT COUNT(*) AS n FROM Workouts WHERE user_id = ?', [targetId]);
    const [[prRow]] = await pool.query('SELECT COUNT(*) AS n FROM PRs WHERE user_id = ?', [targetId]);
    const streak = await computeStreak(targetId);

    res.json({
      id: user.id, username: user.username, avatarUrl: user.avatar_url, bio: user.bio,
      joinedAt: user.created_at, workoutCount: wRow.n, prCount: prRow.n, streak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getProfile };
