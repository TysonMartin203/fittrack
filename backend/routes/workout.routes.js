const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, list, remove } = require('../controllers/workout.controller');
router.use(auth);
router.post('/',        create);
router.get('/',         list);
router.delete('/:id',   remove);
module.exports = router;
