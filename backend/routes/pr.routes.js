const router = require('express').Router();
const auth = require('../middleware/auth');
const { list } = require('../controllers/pr.controller');
router.use(auth);
router.get('/', list);
module.exports = router;
