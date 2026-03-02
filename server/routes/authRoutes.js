const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.post('/change-password', authenticate, changePassword);

module.exports = router;