const express = require('express');
const router = express.Router();
const { addSchool } = require('../controllers/schoolController');

router.post('/', addSchool);

module.exports = router;