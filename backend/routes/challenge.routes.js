const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, join, progress } = require('../controllers/challenge.controller');

router.use(auth);
router.post('/',            create);
router.get('/',              list);
router.post('/:id/join',    join);
router.get('/:id/progress', progress);

module.exports = router;
