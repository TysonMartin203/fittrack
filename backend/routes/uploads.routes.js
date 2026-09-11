const router = require('express').Router();
const authOrQueryToken = require('../middleware/authOrQueryToken');
const { serve } = require('../controllers/uploads.controller');

router.get('/:filename', authOrQueryToken, serve);

module.exports = router;
