const router = require('express').Router();
const auth = require('../middleware/auth');
const { create, listForDate, history, remove } = require('../controllers/meallog.controller');

router.use(auth);
router.post('/',        create);
router.get('/',          listForDate);
router.get('/history',   history);
router.delete('/:id',    remove);

module.exports = router;
