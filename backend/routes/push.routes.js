const router = require('express').Router();
const auth = require('../middleware/auth');
const { vapidPublicKey, subscribe, unsubscribe, list, read, readAll } = require('../controllers/push.controller');

router.get('/vapid-public-key', vapidPublicKey); // public — needed before login-gated subscribe flow isn't required, but keep behind auth for simplicity
router.use(auth);
router.post('/subscribe',    subscribe);
router.post('/unsubscribe',  unsubscribe);
router.get('/notifications', list);
router.put('/notifications/:id/read', read);
router.put('/notifications/read-all', readAll);

module.exports = router;
