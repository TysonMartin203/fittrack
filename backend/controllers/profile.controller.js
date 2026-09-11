const { getProfile, saveProfile } = require('../models/profile.model');

async function get(req, res) {
  try {
    const profile = await getProfile(req.userId);
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function save(req, res) {
  try {
    await saveProfile(req.userId, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { get, save };
