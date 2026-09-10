const router = require('express').Router();
const auth   = require('../middleware/auth');
const { getPlan, saveProfile, generate, swap } = require('../controllers/meal.controller');
router.use(auth);
router.get('/',           getPlan);
router.put('/profile',    saveProfile);
router.post('/generate',  generate);
router.post('/swap',      swap);
module.exports = router;
