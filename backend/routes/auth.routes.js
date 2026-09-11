const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const auth    = require('../middleware/auth');
const { register, login, uploadAvatar, updateTheme, updateSettings } = require('../controllers/auth.controller');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => cb(null, `avatar-${req.userId}-${Date.now()}${path.extname(file.originalname)}`),
});
const uploader = multer({ storage, limits: { fileSize: 5*1024*1024 } });

router.post('/register', register);
router.post('/login',    login);
router.post('/avatar',   auth, uploader.single('avatar'), uploadAvatar);
router.put('/theme',     auth, updateTheme);
router.put('/settings',  auth, updateSettings);
module.exports = router;
