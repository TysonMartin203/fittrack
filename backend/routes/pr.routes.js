const router = require('express').Router();
const auth = require('../middleware/auth');
const { list, exercises, history } = require('../controllers/pr.controller');
router.use(auth);
router.get('/', list);
router.get('/exercises', exercises);
router.get('/history/:exercise', history);
module.exports = router;
