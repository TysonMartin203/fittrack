const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const auth    = require('../middleware/auth');
const UPLOADS_DIR = require('../config/uploadsDir');
const { register, login, googleAuth, uploadAvatar, updateTheme, updateSettings, forgotPassword, resetPassword, completeTutorial } = require('../controllers/auth.controller');

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => cb(null, `avatar-${req.userId}-${Date.now()}${path.extname(file.originalname)}`),
});
const uploader = multer({ storage, limits: { fileSize: 5*1024*1024 } });

router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);
router.post('/tutorial-done', auth, completeTutorial);
router.post('/avatar',   auth, uploader.single('avatar'), uploadAvatar);
router.put('/theme',     auth, updateTheme);
router.put('/settings',  auth, updateSettings);
module.exports = router;
