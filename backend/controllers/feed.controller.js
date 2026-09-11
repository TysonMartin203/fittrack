const { getFeed, setReaction, removeReaction } = require('../models/feed.model');

const VALID_REACTIONS = ['fire', 'flex', 'clap', 'whoa', 'heart'];

async function list(req, res) {
  try {
    res.json(await getFeed(req.userId, req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function react(req, res) {
  try {
    const { reaction } = req.body;
    if (!VALID_REACTIONS.includes(reaction)) return res.status(400).json({ error: 'Invalid reaction' });
    await setReaction(req.params.id, req.userId, reaction);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function unreact(req, res) {
  try {
    await removeReaction(req.params.id, req.userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { list, react, unreact, VALID_REACTIONS };
