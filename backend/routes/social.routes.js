const router = require('express').Router();
const auth = require('../middleware/auth');
const { buzz } = require('../controllers/buzz.controller');
const { getLeaderboard, computeStreak } = require('../models/social.model');

router.use(auth);
router.post('/buzz/:friendId', buzz);
router.get('/leaderboard', async (req, res) => {
  try {
    res.json(await getLeaderboard(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/streak', async (req, res) => {
  try {
    res.json({ streak: await computeStreak(req.userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
