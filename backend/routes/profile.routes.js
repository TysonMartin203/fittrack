const router = require('express').Router();
const auth = require('../middleware/auth');
const { get, save } = require('../controllers/profile.controller');

router.use(auth);
router.get('/', get);
router.put('/', save);

module.exports = router;
