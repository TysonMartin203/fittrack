const { areFriends } = require('../models/friend.model');
const { createNotification } = require('../models/notification.model');
const { sendPushToUser } = require('../models/push.model');
const { findById } = require('../models/user.model');

// Simple cooldown so someone can't spam-buzz a friend — one buzz per pair every 30 min
const lastBuzz = new Map();
const COOLDOWN_MS = 30 * 60 * 1000;

async function buzz(req, res) {
  try {
    const friendId = req.params.friendId;
    const friends = await areFriends(req.userId, friendId);
    if (!friends) return res.status(403).json({ error: 'Not friends' });

    const key = `${req.userId}->${friendId}`;
    const now = Date.now();
    const last = lastBuzz.get(key);
    if (last && now - last < COOLDOWN_MS) {
      return res.status(429).json({ error: 'Already buzzed them recently — give it a bit.' });
    }
    lastBuzz.set(key, now);

    const sender = await findById(req.userId);
    await createNotification({
      userId: friendId, type: 'buzz',
      title: `${sender?.username || 'A friend'} buzzed you!`,
      body: 'Time to go workout 💪',
      data: { from: req.userId },
    });
    await sendPushToUser(friendId, {
      title: `${sender?.username || 'A friend'} buzzed you!`,
      body: 'Time to go workout 💪',
      data: { type: 'buzz', from: req.userId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { buzz };
