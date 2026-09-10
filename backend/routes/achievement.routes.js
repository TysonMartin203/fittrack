const router = require('express').Router();
const auth   = require('../middleware/auth');
const { getAchievements } = require('../controllers/achievement.controller');
router.use(auth);
router.get('/', getAchievements);
module.exports = router;
