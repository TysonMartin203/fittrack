const router = require('express').Router();
const auth = require('../middleware/auth');
const { vapidPublicKey, subscribe, unsubscribe } = require('../controllers/push.controller');

router.get('/vapid-public-key', vapidPublicKey); // public — needed before login
router.use(auth);
router.post('/subscribe',    subscribe);
router.post('/unsubscribe',  unsubscribe);

module.exports = router;
