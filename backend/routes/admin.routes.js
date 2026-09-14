const router = require('express').Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { listUsers, createAccount, deleteAccount, resetUserPassword, listCrews, userWorkouts } = require('../controllers/admin.controller');

router.use(auth);
router.use(requireAdmin);
router.get('/users',                    listUsers);
router.post('/users',                   createAccount);
router.delete('/users/:id',             deleteAccount);
router.post('/users/:id/reset-password', resetUserPassword);
router.get('/users/:id/workouts',       userWorkouts);
router.get('/crews',                    listCrews);

module.exports = router;
