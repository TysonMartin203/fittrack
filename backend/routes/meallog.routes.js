const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { create, listForDate, history, remove, recognize, parseVoice } = require('../controllers/meallog.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.use(auth);
router.post('/',        create);
router.post('/recognize', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'photo2', maxCount: 1 }]), recognize);
router.post('/parse-voice', parseVoice);
router.get('/',          listForDate);
router.get('/history',   history);
router.delete('/:id',    remove);

module.exports = router;
