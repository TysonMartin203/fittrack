const router = require('express').Router();
const auth = require('../middleware/auth');
const { getProfile } = require('../controllers/user.controller');

router.use(auth);
router.get('/:id/profile', getProfile);

module.exports = router;
