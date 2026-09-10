const router = require('express').Router();
const auth = require('../middleware/auth');
const { add, accept, list } = require('../controllers/friend.controller');
router.use(auth);
router.post('/',                       add);
router.put('/:requesterId/accept',     accept);
router.get('/',                        list);
module.exports = router;
