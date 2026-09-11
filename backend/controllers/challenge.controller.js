const { createChallenge, listChallenges, joinChallenge, getChallengeProgress } = require('../models/challenge.model');

async function create(req, res) {
  try {
    const { title, type, exercise, targetValue, startDate, endDate } = req.body;
    if (!title || !type || !startDate || !endDate)
      return res.status(400).json({ error: 'title, type, startDate, endDate required' });
    if (type === 'pr_gain' && !exercise)
      return res.status(400).json({ error: 'exercise required for pr_gain challenges' });
    const id = await createChallenge(req.userId, { title, type, exercise, targetValue, startDate, endDate });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function list(req, res) {
  try {
    res.json(await listChallenges(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function join(req, res) {
  try {
    await joinChallenge(req.params.id, req.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
  }
}

async function getOne(req, res) {
  try {
    const progress = await getChallengeProgress(req.params.id, req.userId);
    if (!progress) return res.status(404).json({ error: 'Not found' });
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { create, list, join, getOne };
