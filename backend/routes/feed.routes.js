const router = require('express').Router();
const auth = require('../middleware/auth');
const { list, react, unreact } = require('../controllers/feed.controller');

router.use(auth);
router.get('/',            list);
router.post('/:id/react',  react);
router.delete('/:id/react',unreact);

module.exports = router;
