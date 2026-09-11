const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, getOne, invite, messages, send } = require('../controllers/crew.controller');

router.use(auth);
router.post('/',               create);
router.get('/',                list);
router.get('/:id',             getOne);
router.post('/:id/members',    invite);
router.get('/:id/messages',    messages);
router.post('/:id/messages',   send);

module.exports = router;
