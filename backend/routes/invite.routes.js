const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, accept, decline } = require('../controllers/invite.controller');

router.use(auth);
router.post('/',            create);
router.get('/',             list);
router.put('/:id/accept',   accept);
router.put('/:id/decline',  decline);

module.exports = router;
