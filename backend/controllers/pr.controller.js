const { getAllPRs } = require('../models/pr.model');

async function list(req, res) {
  try {
    const prs = await getAllPRs(req.userId);
    res.json(prs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { list };
