const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, join, getOne } = require('../controllers/challenge.controller');

router.use(auth);
router.post('/',        create);
router.get('/',         list);
router.get('/:id',      getOne);
router.post('/:id/join',join);

module.exports = router;
