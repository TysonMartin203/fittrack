const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, join } = require('../controllers/challenge.controller');

router.use(auth);
router.post('/',        create);
router.get('/',         list);
router.post('/:id/join',join);

module.exports = router;
